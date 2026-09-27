"""Personal Study Planner: a local, Python-only student organizer."""
import ctypes
import io
import json
import math
import os
import sqlite3
import struct
import threading
import time
import tkinter as tk
import wave
from tkinter import filedialog, messagebox, ttk
from pathlib import Path
from datetime import datetime
import webbrowser

DB = Path(__file__).with_name("study_planner.db")
THEMES = {
    "dark": {
        "BG": "#12110f", "PANEL": "#1c1a18", "FG": "#f5efe7", "MUTED": "#a99d90",
        "ACCENT": "#d6ad83", "DARK_PANEL": "#171513", "BORDER": "#37312b",
        "BLUE": "#c8a781", "PANEL_ALT": "#24211e", "INPUT_BG": "#171513",
        "NAV_TEXT": "#c2b7aa", "NAV_ACTIVE": "#302a24", "ACCENT_TEXT": "#21180f",
        "SOFT": "#d3c8bb", "ROW_BG": "#24211e", "SELECTED": "#40372e",
        "BUTTON_ALT": "#39322b", "DANGER": "#59483a", "SUBTLE": "#81766b",
    },
    "light": {
        "BG": "#f3eee6", "PANEL": "#fffdf9", "FG": "#29231e", "MUTED": "#786d62",
        "ACCENT": "#9b6537", "DARK_PANEL": "#e8dfd3", "BORDER": "#d8cbbd",
        "BLUE": "#765b43", "PANEL_ALT": "#f8f2e9", "INPUT_BG": "#fffefa",
        "NAV_TEXT": "#665c52", "NAV_ACTIVE": "#e7d9c8", "ACCENT_TEXT": "#fffaf4",
        "SOFT": "#51463b", "ROW_BG": "#faf5ed", "SELECTED": "#e5d5c2",
        "BUTTON_ALT": "#e6ddd2", "DANGER": "#d3b89f", "SUBTLE": "#948779",
    },
}
BG = PANEL = FG = MUTED = ACCENT = DARK_PANEL = BORDER = BLUE = ""
PANEL_ALT = INPUT_BG = NAV_TEXT = NAV_ACTIVE = ACCENT_TEXT = SOFT = ROW_BG = ""
SELECTED = BUTTON_ALT = DANGER = SUBTLE = ""


def set_palette(theme):
    globals().update(THEMES[theme])


set_palette("dark")


class StyledDropdown(tk.Menubutton):
    """A compact, warm-themed dropdown built entirely from Tk widgets."""
    def __init__(self, master, values, width=12, on_click=None):
        self.values = tuple(values)
        self.variable = tk.StringVar(master=master)
        self.on_click = on_click
        self.menu = tk.Menu(master, tearoff=False, bg=PANEL, fg=FG,
                            activebackground=SELECTED, activeforeground=FG,
                            disabledforeground=MUTED, bd=1, relief="solid",
                            activeborderwidth=0, font=("Segoe UI", 10))
        super().__init__(master, textvariable=self.variable, menu=self.menu,
                         direction="below", indicatoron=True, anchor="w", width=width,
                         bg=INPUT_BG, fg=FG, activebackground=PANEL_ALT,
                         activeforeground=FG, disabledforeground=MUTED,
                         relief="flat", bd=0, padx=12, pady=9, cursor="hand2",
                         highlightthickness=1, highlightbackground=BORDER,
                         highlightcolor=ACCENT, font=("Segoe UI", 10))
        for value in self.values:
            self.menu.add_command(label=value, command=lambda item=value: self._select(item))
        if on_click:
            self.bind("<Button-1>", on_click, add="+")

    def _select(self, value):
        self.variable.set(value)
        self.event_generate("<<ComboboxSelected>>")

    def get(self):
        return self.variable.get()

    def set(self, value):
        self.variable.set(value)

    def current(self, index):
        self.set(self.values[index])


class Planner(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Personal Study Planner")
        self.geometry("1240x800")
        self.minsize(1040, 700)
        self.configure(bg=BG)
        self.option_add("*Font", ("Segoe UI", 10))
        self.db = sqlite3.connect(DB)
        self.db.row_factory = sqlite3.Row
        self.db.executescript("""
            CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY, title TEXT NOT NULL,
                priority TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0, created TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY, title TEXT NOT NULL,
                body TEXT NOT NULL, created TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS resources(id INTEGER PRIMARY KEY, title TEXT NOT NULL,
                url TEXT NOT NULL, kind TEXT NOT NULL, created TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY, value TEXT NOT NULL);
        """)
        self.db.commit()
        saved_theme = self.db.execute("SELECT value FROM settings WHERE key='theme'").fetchone()
        self.theme = saved_theme[0] if saved_theme and saved_theme[0] in THEMES else "dark"
        set_palette(self.theme)
        self.sound_enabled = True
        self.last_sound_time = 0.0
        self.click_sound = self._make_click_sound() if os.name == "nt" else None
        self.configure(bg=BG)
        self.timer_seconds, self.timer_running, self.timer_job = 25 * 60, False, None
        self.timer_total_seconds = 25 * 60
        self.marker_animation_job = None
        self.marker_request_id = 0
        self.page_animation_job = None
        self.page_transition_cover = None
        self.theme_animation_job = None
        self.theme_transitioning = False
        self.current_page = None
        self._configure_style()
        self._build()
        self.refresh_all()
        self.protocol("WM_DELETE_WINDOW", self.close)

    def _configure_style(self):
        s = ttk.Style(self)
        s.theme_use("clam")
        s.configure("Treeview", background=PANEL, fieldbackground=PANEL, foreground=FG,
                    rowheight=44, borderwidth=0, font=("Segoe UI", 11))
        s.configure("Treeview.Heading", background=PANEL_ALT, foreground=MUTED,
                    font=("Segoe UI", 9, "bold"), relief="flat", padding=(8, 11))
        s.map("Treeview", background=[("selected", SELECTED)], foreground=[("selected", FG)])
        s.configure("Planner.Horizontal.TProgressbar", troughcolor=INPUT_BG,
                    background=ACCENT, bordercolor=BORDER, lightcolor=ACCENT,
                    darkcolor=ACCENT, thickness=10)

    def _build(self):
        self.current_page = None
        self.shell = tk.Frame(self, bg=BG)
        self.shell.pack(fill="both", expand=True)
        self.sidebar = tk.Frame(self.shell, bg=DARK_PANEL, width=238)
        self.sidebar.pack(side="left", fill="y")
        self.sidebar.pack_propagate(False)
        brand = tk.Frame(self.sidebar, bg=DARK_PANEL)
        brand.pack(fill="x", padx=22, pady=(27, 30))
        tk.Label(brand, text="U", bg=ACCENT, fg=ACCENT_TEXT, width=2, height=1,
                 font=("Segoe UI", 15, "bold")).pack(side="left", padx=(0, 10), ipady=4)
        tk.Label(brand, text="UNINEST", bg=DARK_PANEL, fg=FG,
                 font=("Segoe UI", 15, "bold")).pack(anchor="w")
        tk.Label(brand, text="STUDY SYSTEM", bg=DARK_PANEL, fg=MUTED,
                 font=("Segoe UI", 8, "bold")).pack(anchor="w")
        tk.Label(self.sidebar, text="WORKSPACE", bg=DARK_PANEL, fg=SUBTLE,
                 font=("Segoe UI", 8, "bold")).pack(anchor="w", padx=24, pady=(0, 8))
        self.nav_buttons = {}
        for name, glyph in (("Dashboard", "◈"), ("Tasks", "✓"), ("Notes", "▤"),
                            ("Resources", "↗"), ("Focus timer", "◷")):
            button = tk.Button(self.sidebar, text=f"   {glyph}     {name}", anchor="w",
                               command=lambda n=name: self.show_page(n), bg=DARK_PANEL,
                               fg=NAV_TEXT, activebackground=NAV_ACTIVE, activeforeground=FG,
                               relief="flat", bd=0, padx=15, pady=13, cursor="hand2",
                               font=("Segoe UI", 10, "bold"))
            button.bind("<Button-1>", self._click_feedback, add="+")
            button.pack(fill="x", padx=12, pady=2)
            self.nav_buttons[name] = button
        self.nav_marker = tk.Frame(self.sidebar, bg=ACCENT, width=3, height=34)
        self.nav_marker.place(x=8, y=0)
        tk.Frame(self.sidebar, bg=BORDER, height=1).pack(fill="x", padx=20, pady=20)
        tk.Label(self.sidebar, text="LOCAL FIRST", bg=DARK_PANEL, fg=ACCENT,
                 font=("Segoe UI", 8, "bold")).pack(anchor="w", padx=24)
        tk.Label(self.sidebar, text="Your data stays on this device.", bg=DARK_PANEL, fg=MUTED,
                 font=("Segoe UI", 9)).pack(anchor="w", padx=24, pady=(5, 0))
        self.content = tk.Frame(self.shell, bg=BG)
        self.content.pack(side="left", fill="both", expand=True)
        toolbar = tk.Frame(self.content, bg=BG)
        toolbar.pack(fill="x", padx=30, pady=(20, 0))
        tk.Label(toolbar, text="PERSONAL STUDY PLANNER", bg=BG, fg=MUTED,
                 font=("Segoe UI", 9, "bold")).pack(side="left")
        actions = tk.Frame(toolbar, bg=BG); actions.pack(side="right")
        self.theme_button = self._btn(actions, self._theme_label(), self.toggle_theme, PANEL_ALT)
        self.theme_button.pack(side="left", padx=(0, 7))
        self._btn(actions, "EXPORT DATA", self.export_data).pack(side="left")
        self.page_host = tk.Frame(self.content, bg=BG)
        self.page_host.pack(fill="both", expand=True)
        self.pages = {}
        for name in ("Dashboard", "Tasks", "Notes", "Resources", "Focus timer"):
            page = tk.Frame(self.page_host, bg=BG)
            page.place(x=0, y=0, relwidth=1, relheight=1)
            self.pages[name] = page
        self._dashboard_page()
        self._tasks_page()
        self._notes_page()
        self._resources_page()
        self._timer_page()
        self.show_page("Dashboard", animate=False)

    def show_page(self, name, animate=True):
        if self.page_animation_job:
            self.after_cancel(self.page_animation_job)
            self.page_animation_job = None
            if self.page_transition_cover and self.page_transition_cover.winfo_exists():
                self.page_transition_cover.destroy()
            for page in self.pages.values():
                page.place_configure(x=0, y=0)
            if self.current_page in self.pages:
                self.pages[self.current_page].tkraise()
        old_name = self.current_page
        if animate and old_name in self.pages and old_name != name and self.page_host.winfo_width() > 10:
            self._animate_page_switch(name)
        else:
            self.current_page = name
            self.pages[name].place_configure(x=0, y=0)
            self.pages[name].tkraise()
            self._position_nav(name, animate)
        for page, button in self.nav_buttons.items():
            button.configure(bg=NAV_ACTIVE if page == name else DARK_PANEL,
                             fg=ACCENT if page == name else NAV_TEXT)
        if animate and old_name in self.pages and old_name != name:
            self._position_nav(name, True)

    def _animate_page_switch(self, name):
        page = self.pages[name]
        lift = 14
        self.current_page = name
        page.place_configure(x=0, y=lift)
        page.tkraise()
        cover = tk.Frame(self.page_host, bg=BG, bd=0, highlightthickness=0)
        cover.place(x=0, y=0, relwidth=1, height=lift)
        cover.lift()
        self.page_transition_cover = cover
        frames = 12

        def step(frame):
            t = frame / frames
            eased = 1 - (1 - t) ** 3
            offset = round(lift * (1 - eased))
            page.place_configure(y=offset)
            cover.place_configure(height=offset)
            if frame >= frames:
                page.place_configure(y=0)
                cover.destroy()
                self.page_transition_cover = None
                self.page_animation_job = None
                return
            self.page_animation_job = self.after(14, lambda: step(frame + 1))

        step(0)

    def _position_nav(self, name, animate):
        self.current_page = name
        self.marker_request_id += 1
        request_id = self.marker_request_id
        self.after_idle(lambda: self._move_nav_marker(name, animate, request_id))

    def _move_nav_marker(self, name, animate, request_id):
        if request_id != self.marker_request_id or not self.nav_marker.winfo_exists():
            return
        if self.marker_animation_job:
            self.after_cancel(self.marker_animation_job)
            self.marker_animation_job = None
        button = self.nav_buttons[name]
        target_y = button.winfo_y() + max(0, (button.winfo_height() - 34) // 2)
        start_y = self.nav_marker.winfo_y()
        if not animate or abs(target_y - start_y) < 2:
            self.nav_marker.place_configure(y=target_y)
            return
        frames = 12

        def step(frame):
            if request_id != self.marker_request_id:
                return
            t = frame / frames
            eased = 1 - (1 - t) ** 3
            y = round(start_y + (target_y - start_y) * eased)
            self.nav_marker.place_configure(y=y)
            if frame >= frames:
                self.nav_marker.place_configure(y=target_y)
                self.marker_animation_job = None
            else:
                self.marker_animation_job = self.after(12, lambda: step(frame + 1))

    def _heading(self, page, title, subtitle):
        tk.Label(page, text=title, bg=BG, fg=FG, font=("Segoe UI", 27, "bold")).pack(anchor="w", padx=34, pady=(30, 3))
        tk.Label(page, text=subtitle, bg=BG, fg=MUTED, font=("Segoe UI", 10)).pack(anchor="w", padx=36, pady=(0, 22))

    def _card(self, parent, title):
        box = tk.Frame(parent, bg=PANEL, highlightthickness=1, highlightbackground=BORDER)
        tk.Label(box, text=title.upper(), bg=PANEL, fg=SOFT, font=("Segoe UI", 9, "bold")).pack(anchor="w", padx=19, pady=(15, 10))
        return box

    def _btn(self, parent, label, command, color=None):
        color = ACCENT if color is None else color
        fg = ACCENT_TEXT if color == ACCENT else FG
        button = tk.Button(parent, text=label, command=command, bg=color, fg=fg,
                           activebackground=SELECTED if color == ACCENT else BORDER,
                           activeforeground=fg, relief="flat", bd=0, padx=16, pady=10,
                           cursor="hand2", font=("Segoe UI", 9, "bold"))
        button.bind("<Button-1>", self._click_feedback, add="+")
        return button

    def _entry(self, parent, width=None):
        return tk.Entry(parent, width=width, bg=INPUT_BG, fg=FG, insertbackground=ACCENT,
                        relief="flat", highlightthickness=1, highlightbackground=BORDER,
                        highlightcolor=ACCENT, font=("Segoe UI", 10))

    def _dashboard_page(self):
        p = self.pages["Dashboard"]
        self._heading(p, "Your study space", "Plan your work. Protect your focus. Make today count.")
        hero = tk.Frame(p, bg=PANEL_ALT, highlightthickness=1, highlightbackground=BORDER)
        hero.pack(fill="x", padx=30, pady=(0, 18))
        tk.Frame(hero, bg=ACCENT, width=5).pack(side="left", fill="y")
        hero_copy = tk.Frame(hero, bg=PANEL_ALT)
        hero_copy.pack(side="left", fill="x", expand=True, padx=20, pady=17)
        tk.Label(hero_copy, text="MAKE ROOM FOR DEEP WORK", bg=PANEL_ALT, fg=ACCENT,
                 font=("Segoe UI", 8, "bold")).pack(anchor="w")
        tk.Label(hero_copy, text="One plan. Less noise. Better study sessions.", bg=PANEL_ALT, fg=FG,
                 font=("Segoe UI", 15, "bold")).pack(anchor="w", pady=(5, 2))
        tk.Label(hero_copy, text="Your tasks, notes, and resources are ready when you are.", bg=PANEL_ALT, fg=MUTED,
                 font=("Segoe UI", 9)).pack(anchor="w")
        self._btn(hero, "Start a focus session  →", lambda: self.show_page("Focus timer")).pack(side="right", padx=22, pady=22)
        self.stats = tk.Frame(p, bg=BG)
        self.stats.pack(fill="x", padx=25)
        progress = self._card(p, "Study progress")
        progress.pack(fill="x", padx=30, pady=(12, 0))
        progress_row = tk.Frame(progress, bg=PANEL)
        progress_row.pack(fill="x", padx=18, pady=(0, 15))
        self.progress_summary = tk.Label(progress_row, text="0% complete", bg=PANEL,
                                         fg=FG, font=("Segoe UI", 10, "bold"))
        self.progress_summary.pack(side="left", padx=(0, 16))
        self.progress_bar = ttk.Progressbar(progress_row, maximum=100,
                                             style="Planner.Horizontal.TProgressbar")
        self.progress_bar.pack(side="left", fill="x", expand=True)
        self.pending_frame = self._card(p, "Next up")
        self.pending_frame.pack(fill="both", expand=True, padx=30, pady=16)
        self.quick = tk.Frame(p, bg=PANEL)
        self.quick.pack(fill="x", padx=30, pady=(0, 20))
        tk.Label(self.quick, text="Quick add task", bg=PANEL, fg=FG, font=("Segoe UI", 11, "bold")).pack(side="left", padx=12)
        self.quick_entry = self._entry(self.quick)
        self.quick_entry.pack(side="left", fill="x", expand=True, padx=8, pady=10, ipady=7)
        self._btn(self.quick, "Add", self._quick_add).pack(side="right", padx=10)

    def _tasks_page(self):
        p = self.pages["Tasks"]
        self._heading(p, "Tasks", "Add study tasks, set priorities, and mark work complete.")
        box = self._card(p, "Add a task")
        box.pack(fill="x", padx=30, pady=(0, 16))
        row = tk.Frame(box, bg=PANEL); row.pack(fill="x", padx=14, pady=(0, 14))
        self.task_entry = self._entry(row); self.task_entry.pack(side="left", fill="x", expand=True, ipady=9, padx=(0, 8))
        self.task_priority = StyledDropdown(row, ("Normal", "High", "Low"), width=10,
                                            on_click=self._click_feedback)
        self.task_priority.set("Normal"); self.task_priority.pack(side="left", padx=(0, 8))
        self._btn(row, "Add task", self._add_task).pack(side="left")
        listing = self._card(p, "Your task list"); listing.pack(fill="both", expand=True, padx=30, pady=(0, 22))
        self.task_tree = ttk.Treeview(listing, columns=("done", "title", "priority"), show="headings", selectmode="browse")
        for col, label, width in (("done", "Done", 70), ("title", "Task", 500), ("priority", "Priority", 120)):
            self.task_tree.heading(col, text=label); self.task_tree.column(col, width=width, anchor="w")
        self.task_tree.pack(fill="both", expand=True, padx=12, pady=8)
        actions = tk.Frame(listing, bg=PANEL); actions.pack(fill="x", padx=12, pady=(0, 12))
        self._btn(actions, "Toggle complete", self._toggle_task).pack(side="left", padx=(0, 8))
        self._btn(actions, "Delete selected", self._delete_task, DANGER).pack(side="left")

    def _notes_page(self):
        p = self.pages["Notes"]
        self._heading(p, "Notes", "Capture class notes and useful ideas; they stay on this computer.")
        box = self._card(p, "Write a note"); box.pack(fill="x", padx=30, pady=(0, 16))
        self.note_title = self._entry(box); self.note_title.pack(fill="x", padx=14, pady=(0, 8), ipady=8)
        self.note_body = tk.Text(box, height=4, bg=INPUT_BG, fg=FG, insertbackground=ACCENT, relief="flat", wrap="word", font=("Segoe UI", 10))
        self.note_body.pack(fill="x", padx=14, pady=(0, 8))
        self._btn(box, "Save note", self._add_note).pack(anchor="e", padx=14, pady=(0, 12))
        saved = self._card(p, "Saved notes"); saved.pack(fill="both", expand=True, padx=30, pady=(0, 22))
        self.notes_list = tk.Frame(saved, bg=PANEL); self.notes_list.pack(fill="both", expand=True, padx=10, pady=8)

    def _resources_page(self):
        p = self.pages["Resources"]
        self._heading(p, "Resources", "Keep study links in one place and open them when you need them.")
        box = self._card(p, "Save a resource"); box.pack(fill="x", padx=30, pady=(0, 16))
        row = tk.Frame(box, bg=PANEL); row.pack(fill="x", padx=12, pady=(0, 12))
        self.resource_title = self._entry(row); self.resource_title.pack(side="left", fill="x", expand=True, ipady=8, padx=(0, 7))
        self.resource_url = self._entry(row); self.resource_url.pack(side="left", fill="x", expand=True, ipady=8, padx=(0, 7))
        self.resource_kind = StyledDropdown(row, ("Link", "PDF", "Video", "Article", "Tool"), width=9,
                                            on_click=self._click_feedback)
        self.resource_kind.set("Link"); self.resource_kind.pack(side="left", padx=(0, 7))
        self._btn(row, "Save", self._add_resource).pack(side="left")
        saved = self._card(p, "Saved resources"); saved.pack(fill="both", expand=True, padx=30, pady=(0, 22))
        self.resources_list = tk.Frame(saved, bg=PANEL); self.resources_list.pack(fill="both", expand=True, padx=10, pady=8)

    def _timer_page(self):
        p = self.pages["Focus timer"]
        self._heading(p, "Focus timer", "Choose a session length and give one task your full attention.")
        box = self._card(p, "FOCUS / 01"); box.pack(fill="both", expand=True, padx=100, pady=(0, 32))
        dial = tk.Canvas(box, width=280, height=280, bg=PANEL, highlightthickness=0, bd=0)
        dial.pack(pady=(22, 2))
        dial.create_oval(8, 8, 272, 272, outline=BORDER, width=1)
        dial.create_oval(25, 25, 255, 255, outline=INPUT_BG, width=9)
        self.timer_arc = dial.create_arc(25, 25, 255, 255, start=90, extent=0,
                                         style="arc", outline=ACCENT, width=8,
                                         tags=("timer-progress",))
        self.timer_text = dial.create_text(140, 130, text="25:00", fill=FG,
                                           font=("Segoe UI", 43, "bold"))
        dial.create_text(140, 174, text="FOCUS SESSION", fill=MUTED,
                         font=("Segoe UI", 8, "bold"))
        self.timer_visual = dial
        self.timer_status = tk.Label(box, text="Ready for a focus session.", bg=PANEL, fg=MUTED, font=("Segoe UI", 11))
        self.timer_status.pack(pady=(1, 10))
        row = tk.Frame(box, bg=PANEL); row.pack(pady=15)
        self._btn(row, "Start", self._start_timer).pack(side="left", padx=5)
        self._btn(row, "Pause", self._pause_timer, BUTTON_ALT).pack(side="left", padx=5)
        self._btn(row, "Reset", self._reset_timer, BUTTON_ALT).pack(side="left", padx=5)
        self.timer_choice = StyledDropdown(box, ("25 minutes", "50 minutes", "15 minutes"), width=18,
                                           on_click=self._click_feedback)
        self.timer_choice.current(0); self.timer_choice.pack(pady=14); self.timer_choice.bind("<<ComboboxSelected>>", self._choose_timer)

    def _now(self):
        return datetime.now().isoformat(timespec="minutes")

    def _theme_label(self):
        return "LIGHT MODE" if self.theme == "dark" else "DARK MODE"

    def toggle_theme(self):
        if self.theme_transitioning:
            return
        self.theme_transitioning = True
        if self.page_animation_job:
            self.after_cancel(self.page_animation_job)
            self.page_animation_job = None
        if self.page_transition_cover and self.page_transition_cover.winfo_exists():
            self.page_transition_cover.destroy()
            self.page_transition_cover = None
        if self.current_page in self.pages:
            for page in self.pages.values():
                page.place_configure(x=0, y=0)
            self.pages[self.current_page].tkraise()
        self.marker_request_id += 1
        if self.marker_animation_job:
            self.after_cancel(self.marker_animation_job)
            self.marker_animation_job = None
        current_page = getattr(self, "current_page", "Dashboard")
        self._pause_timer()
        draft = {
            "quick": self.quick_entry.get(),
            "task": self.task_entry.get(),
            "priority": self.task_priority.get(),
            "note_title": self.note_title.get(),
            "note_body": self.note_body.get("1.0", "end-1c"),
            "resource_title": self.resource_title.get(),
            "resource_url": self.resource_url.get(),
            "resource_kind": self.resource_kind.get(),
            "timer_preset": self.timer_choice.get(),
        }
        self._animate_theme(0, current_page, draft)

    def _animate_theme(self, frame, current_page, draft):
        opacity = (1.0, 0.95, 0.88, 0.95, 1.0)
        try:
            self.attributes("-alpha", opacity[frame])
        except tk.TclError:
            pass
        if frame == 2:
            self._apply_theme(current_page, draft)
        if frame == len(opacity) - 1:
            self.theme_transitioning = False
            self.theme_animation_job = None
            return
        self.theme_animation_job = self.after(
            18, lambda: self._animate_theme(frame + 1, current_page, draft))

    def _apply_theme(self, current_page, draft):
        self.theme = "light" if self.theme == "dark" else "dark"
        self.db.execute("INSERT OR REPLACE INTO settings(key,value) VALUES('theme',?)", (self.theme,))
        self.db.commit()
        set_palette(self.theme)
        self.configure(bg=BG)
        self.shell.destroy()
        self._configure_style()
        self._build()
        self.refresh_all()
        self.quick_entry.insert(0, draft["quick"])
        self.task_entry.insert(0, draft["task"])
        self.task_priority.set(draft["priority"])
        self.note_title.insert(0, draft["note_title"])
        self.note_body.insert("1.0", draft["note_body"])
        self.resource_title.insert(0, draft["resource_title"])
        self.resource_url.insert(0, draft["resource_url"])
        self.resource_kind.set(draft["resource_kind"])
        self.timer_choice.set(draft["timer_preset"])
        self._show_time()
        self.show_page(current_page, animate=False)

    def _click_feedback(self, _event=None):
        self._play_sound()

    @staticmethod
    def _make_click_sound():
        sample_rate = 22050
        sample_count = int(sample_rate * 0.035)
        samples = bytearray()
        for i in range(sample_count):
            envelope = min(1.0, i / 80, (sample_count - i) / 120)
            value = int(1900 * envelope * math.sin(2 * math.pi * 392 * i / sample_rate))
            samples.extend(struct.pack("<h", value))
        stream = io.BytesIO()
        with wave.open(stream, "wb") as sound:
            sound.setnchannels(1)
            sound.setsampwidth(2)
            sound.setframerate(sample_rate)
            sound.writeframes(samples)
        return stream.getvalue()

    def _play_sound(self):
        if not self.sound_enabled:
            return
        now = time.monotonic()
        if now - self.last_sound_time < 0.035:
            return
        self.last_sound_time = now
        if os.name == "nt":
            def beep():
                try:
                    import winsound
                    winsound.PlaySound(self.click_sound, winsound.SND_MEMORY)
                except (ImportError, RuntimeError):
                    pass
            threading.Thread(target=beep, daemon=True).start()
        else:
            try:
                self.bell()
            except tk.TclError:
                pass

    def export_data(self):
        filename = f"personal_study_planner_{datetime.now():%Y%m%d_%H%M}.json"
        path = filedialog.asksaveasfilename(
            title="Export planner data", initialfile=filename,
            defaultextension=".json", filetypes=(("JSON file", "*.json"), ("All files", "*.*")))
        if not path:
            return
        content = {
            "app": "Personal Study Planner",
            "exported_at": datetime.now().isoformat(timespec="seconds"),
            "tasks": [dict(row) for row in self.db.execute("SELECT * FROM tasks ORDER BY id")],
            "notes": [dict(row) for row in self.db.execute("SELECT * FROM notes ORDER BY id")],
            "resources": [dict(row) for row in self.db.execute("SELECT * FROM resources ORDER BY id")],
        }
        try:
            with open(path, "w", encoding="utf-8") as output:
                json.dump(content, output, ensure_ascii=False, indent=2)
        except OSError as error:
            messagebox.showerror("Export failed", f"Could not write the export file.\n{error}")
            return
        messagebox.showinfo("Export complete", f"Your planner data was saved to:\n{path}")

    def _quick_add(self):
        text = self.quick_entry.get().strip()
        if not text:
            return
        self.db.execute("INSERT INTO tasks(title,priority,created) VALUES(?,?,?)", (text, "Normal", self._now()))
        self.db.commit(); self.quick_entry.delete(0, "end"); self._refresh_dashboard(); self._refresh_tasks()

    def _add_task(self):
        text = self.task_entry.get().strip()
        if not text:
            messagebox.showinfo("Add task", "Enter a task name first."); return
        self.db.execute("INSERT INTO tasks(title,priority,created) VALUES(?,?,?)", (text, self.task_priority.get(), self._now()))
        self.db.commit(); self.task_entry.delete(0, "end"); self._refresh_dashboard(); self._refresh_tasks()

    def _selected_task(self):
        selected = self.task_tree.selection()
        if not selected:
            messagebox.showinfo("Select task", "Choose a task from the list first."); return None
        return int(selected[0])

    def _toggle_task(self):
        task_id = self._selected_task()
        if task_id is not None:
            self.db.execute("UPDATE tasks SET done=1-done WHERE id=?", (task_id,)); self.db.commit(); self._refresh_dashboard(); self._refresh_tasks()

    def _delete_task(self):
        task_id = self._selected_task()
        if task_id is not None:
            self.db.execute("DELETE FROM tasks WHERE id=?", (task_id,)); self.db.commit(); self._refresh_dashboard(); self._refresh_tasks()

    def _add_note(self):
        title, body = self.note_title.get().strip(), self.note_body.get("1.0", "end").strip()
        if not title or not body:
            messagebox.showinfo("Save note", "Enter a title and some note content."); return
        self.db.execute("INSERT INTO notes(title,body,created) VALUES(?,?,?)", (title, body, self._now()))
        self.db.commit(); self.note_title.delete(0, "end"); self.note_body.delete("1.0", "end"); self.refresh_notes(); self._refresh_dashboard()

    def _delete_note(self, note_id):
        self.db.execute("DELETE FROM notes WHERE id=?", (note_id,)); self.db.commit(); self.refresh_notes(); self._refresh_dashboard()

    def _add_resource(self):
        title, url = self.resource_title.get().strip(), self.resource_url.get().strip()
        if not title or not url.startswith(("https://", "http://")):
            messagebox.showinfo("Save resource", "Enter a title and a URL beginning with http:// or https://."); return
        self.db.execute("INSERT INTO resources(title,url,kind,created) VALUES(?,?,?,?)", (title, url, self.resource_kind.get(), self._now()))
        self.db.commit(); self.resource_title.delete(0, "end"); self.resource_url.delete(0, "end"); self.refresh_resources(); self._refresh_dashboard()

    def _delete_resource(self, resource_id):
        self.db.execute("DELETE FROM resources WHERE id=?", (resource_id,)); self.db.commit(); self.refresh_resources(); self._refresh_dashboard()

    def _refresh_dashboard(self):
        for child in self.stats.winfo_children(): child.destroy()
        total = self.db.execute("SELECT COUNT(*) FROM tasks").fetchone()[0]
        pending = self.db.execute("SELECT COUNT(*) FROM tasks WHERE done=0").fetchone()[0]
        done = total - pending
        counts = (("Tasks complete", f"{done} / {total}"), ("To do", str(pending)),
                  ("Notes", str(self.db.execute("SELECT COUNT(*) FROM notes").fetchone()[0])),
                  ("Resources", str(self.db.execute("SELECT COUNT(*) FROM resources").fetchone()[0])))
        for label, value in counts:
            card = tk.Frame(self.stats, bg=PANEL, highlightthickness=1, highlightbackground=BORDER)
            card.pack(side="left", fill="x", expand=True, padx=5)
            tk.Label(card, text=label.upper(), bg=PANEL, fg=MUTED, font=("Segoe UI", 8, "bold")).pack(anchor="w", padx=15, pady=(13, 3))
            tk.Label(card, text=value, bg=PANEL, fg=ACCENT if label == "Tasks complete" else FG,
                     font=("Segoe UI", 23, "bold")).pack(anchor="w", padx=15, pady=(0, 13))
        for child in self.pending_frame.winfo_children()[1:]: child.destroy()
        rows = self.db.execute("SELECT title,priority FROM tasks WHERE done=0 ORDER BY CASE priority WHEN 'High' THEN 0 WHEN 'Normal' THEN 1 ELSE 2 END,id DESC LIMIT 7").fetchall()
        if not rows:
            tk.Label(self.pending_frame, text="You’re clear. Add a task when you’re ready for the next one.", bg=PANEL, fg=MUTED).pack(anchor="w", padx=19, pady=10)
        for r in rows:
            tk.Label(self.pending_frame, text=f"↗   {r['title']}      /      {r['priority'].upper()}", bg=PANEL, fg=FG, font=("Segoe UI", 10)).pack(anchor="w", padx=19, pady=6)
        percent = int(done * 100 / total) if total else 0
        self.progress_summary.config(text=f"{percent}% complete  ·  {done} of {total} tasks")
        self.progress_bar["value"] = percent
        tk.Label(self.pending_frame, text=f"OVERALL TASK PROGRESS     {percent}%", bg=PANEL, fg=ACCENT, font=("Segoe UI", 9, "bold")).pack(anchor="w", padx=19, pady=(12, 14))

    def _refresh_tasks(self):
        for item in self.task_tree.get_children(): self.task_tree.delete(item)
        for row in self.db.execute("SELECT * FROM tasks ORDER BY done, id DESC"):
            self.task_tree.insert("", "end", iid=str(row["id"]), values=("✓" if row["done"] else "□", row["title"], row["priority"]))

    def refresh_notes(self):
        for child in self.notes_list.winfo_children(): child.destroy()
        rows = self.db.execute("SELECT * FROM notes ORDER BY id DESC").fetchall()
        if not rows:
            tk.Label(self.notes_list, text="No notes saved yet.", bg=PANEL, fg=MUTED).pack(anchor="w", padx=8, pady=8)
        for row in rows:
            item = tk.Frame(self.notes_list, bg=ROW_BG, highlightthickness=1, highlightbackground=BORDER); item.pack(fill="x", pady=5)
            tk.Label(item, text=row["title"], bg=ROW_BG, fg=FG, font=("Segoe UI", 10, "bold")).pack(anchor="w", padx=13, pady=(10, 3))
            tk.Label(item, text=row["body"], bg=ROW_BG, fg=SOFT, wraplength=700, justify="left").pack(anchor="w", padx=13, pady=(0, 7))
            self._btn(item, "Delete", lambda n=row["id"]: self._delete_note(n), DANGER).pack(anchor="e", padx=8, pady=(0, 7))

    def refresh_resources(self):
        for child in self.resources_list.winfo_children(): child.destroy()
        rows = self.db.execute("SELECT * FROM resources ORDER BY id DESC").fetchall()
        if not rows:
            tk.Label(self.resources_list, text="No resources saved yet.", bg=PANEL, fg=MUTED).pack(anchor="w", padx=8, pady=8)
        for row in rows:
            item = tk.Frame(self.resources_list, bg=ROW_BG, highlightthickness=1, highlightbackground=BORDER); item.pack(fill="x", pady=5)
            tk.Label(item, text=f"{row['title']}   ·   {row['kind']}", bg=ROW_BG, fg=FG, font=("Segoe UI", 10, "bold")).pack(side="left", padx=13, pady=13)
            self._btn(item, "Delete", lambda n=row["id"]: self._delete_resource(n), DANGER).pack(side="right", padx=6, pady=5)
            self._btn(item, "Open", lambda u=row["url"]: webbrowser.open(u)).pack(side="right", padx=6, pady=5)

    def refresh_all(self):
        self._refresh_dashboard(); self._refresh_tasks(); self.refresh_notes(); self.refresh_resources()

    def _choose_timer(self, _event=None):
        self._pause_timer()
        minutes = {"25 minutes": 25, "50 minutes": 50, "15 minutes": 15}[self.timer_choice.get()]
        self.timer_seconds = self.timer_total_seconds = minutes * 60
        self._show_time(); self.timer_status.config(text="Ready for a focus session.")

    def _show_time(self):
        if not hasattr(self, "timer_visual") or not self.timer_visual.winfo_exists():
            return
        self.timer_visual.itemconfigure(self.timer_text,
                                        text=f"{self.timer_seconds // 60:02d}:{self.timer_seconds % 60:02d}")
        elapsed = 1 - self.timer_seconds / max(1, self.timer_total_seconds)
        self.timer_visual.itemconfigure(self.timer_arc, extent=-360 * max(0, min(1, elapsed)))

    def _start_timer(self):
        if not self.timer_running:
            self.timer_running = True; self.timer_status.config(text="Focus session in progress."); self._tick()

    def _tick(self):
        if not self.timer_running: return
        if self.timer_seconds <= 0:
            self.timer_running = False; self.timer_status.config(text="Session complete. Take a short break.")
            self._play_sound()
            messagebox.showinfo("Focus session complete", "Nice work. Take a short break."); return
        self.timer_seconds -= 1; self._show_time(); self.timer_job = self.after(1000, self._tick)

    def _pause_timer(self):
        self.timer_running = False
        if self.timer_job:
            self.after_cancel(self.timer_job); self.timer_job = None
        if hasattr(self, "timer_status"): self.timer_status.config(text="Timer paused.")

    def _reset_timer(self):
        self._pause_timer()
        minutes = {"25 minutes": 25, "50 minutes": 50, "15 minutes": 15}[self.timer_choice.get()]
        self.timer_seconds = self.timer_total_seconds = minutes * 60
        self._show_time(); self.timer_status.config(text="Ready for a focus session.")

    def close(self):
        self._pause_timer(); self.db.close(); self.destroy()


def enable_windows_dpi_awareness():
    """Keep Windows from bitmap-scaling the window and making text look soft."""
    if os.name != "nt":
        return
    try:
        # Per-monitor v2 gives Tk the actual display scale instead of a scaled bitmap.
        if ctypes.windll.user32.SetProcessDpiAwarenessContext(ctypes.c_void_p(-4)):
            return
    except (AttributeError, OSError):
        pass
    try:
        ctypes.windll.shcore.SetProcessDpiAwareness(2)
    except (AttributeError, OSError):
        try:
            ctypes.windll.user32.SetProcessDPIAware()
        except (AttributeError, OSError):
            pass


if __name__ == "__main__":
    enable_windows_dpi_awareness()
    Planner().mainloop()
