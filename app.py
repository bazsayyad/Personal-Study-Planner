"""UniNest browser app: local accounts, Flask API, and SQLite storage."""
from __future__ import annotations

import json
import os
import re
import secrets
import sqlite3
from contextlib import contextmanager
from datetime import datetime
from functools import wraps
from pathlib import Path
from urllib.parse import urlparse

from flask import Flask, abort, g, jsonify, render_template, request, session
from werkzeug.exceptions import HTTPException
from werkzeug.security import check_password_hash, generate_password_hash


ROOT = Path(__file__).resolve().parent
DB = ROOT / os.environ.get("UNINEST_DB", "study_planner.db")
DEMO_MODE = os.environ.get("UNINEST_DEMO") == "1"
app = Flask(__name__, static_folder=str(ROOT / "static"), static_url_path="/static")


def session_secret():
    configured = os.environ.get("UNINEST_SECRET_KEY")
    if configured:
        return configured
    key_file = ROOT / ".uninest-session-key"
    if key_file.exists():
        return key_file.read_text(encoding="utf-8").strip()
    key = secrets.token_hex(32)
    try:
        key_file.write_text(key, encoding="utf-8")
    except OSError:
        return key
    return key


app.secret_key = session_secret()
app.config.update(SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE="Lax",
                  SESSION_COOKIE_SECURE=False, PERMANENT_SESSION_LIFETIME=60 * 60 * 24 * 14,
                  MAX_CONTENT_LENGTH=8 * 1024 * 1024)


@contextmanager
def database():
    connection = sqlite3.connect(DB, timeout=10)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def initialize_database():
    with database() as db:
        db.executescript("""
            CREATE TABLE IF NOT EXISTS users(
                id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL, created TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS tasks(
                id INTEGER PRIMARY KEY, title TEXT NOT NULL, priority TEXT NOT NULL,
                done INTEGER NOT NULL DEFAULT 0, created TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS notes(
                id INTEGER PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL,
                created TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS resources(
                id INTEGER PRIMARY KEY, title TEXT NOT NULL, url TEXT NOT NULL,
                kind TEXT NOT NULL, created TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY, value TEXT NOT NULL);
        """)
        for table in ("tasks", "notes", "resources"):
            columns = {row[1] for row in db.execute(f"PRAGMA table_info({table})")}
            if "user_id" not in columns:
                db.execute(f"ALTER TABLE {table} ADD COLUMN user_id INTEGER REFERENCES users(id)")
            db.execute(f"CREATE INDEX IF NOT EXISTS idx_{table}_user_id ON {table}(user_id)")

        if DEMO_MODE:
            demo = db.execute("SELECT id FROM users WHERE email='demo@uninest.local'").fetchone()
            if demo is None:
                cursor = db.execute(
                    "INSERT INTO users(name,email,password_hash,created) VALUES(?,?,?,?)",
                    ("Demo Student", "demo@uninest.local", generate_password_hash("uninest-demo", method="pbkdf2:sha256:600000"),
                     datetime.now().isoformat(timespec="minutes")))
                demo_id = cursor.lastrowid
            else:
                demo_id = demo[0]
            for table in ("tasks", "notes", "resources"):
                db.execute(f"UPDATE {table} SET user_id=? WHERE user_id IS NULL", (demo_id,))
            if not db.execute("SELECT 1 FROM settings WHERE key='demo_seeded'").fetchone():
                now = datetime.now()
                if not any(db.execute(f"SELECT 1 FROM {table} WHERE user_id=? LIMIT 1", (demo_id,)).fetchone()
                           for table in ("tasks", "notes", "resources")):
                    tasks = (
                        ("Review lecture notes", "Normal", 1, now.replace(hour=9, minute=20).isoformat(timespec="minutes"), demo_id),
                        ("Make flashcards for cell biology", "High", 0, now.replace(hour=10, minute=5).isoformat(timespec="minutes"), demo_id),
                        ("Finish calculus problem set", "High", 0, now.replace(hour=11, minute=10).isoformat(timespec="minutes"), demo_id),
                        ("Read chapter six: memory systems", "Normal", 0, now.replace(hour=13, minute=30).isoformat(timespec="minutes"), demo_id),
                    )
                    notes = (
                        ("A better way to revise", "Read a section, close the book, and write down everything I remember. Then check the gaps. Active recall beats another passive reread.", now.isoformat(timespec="minutes"), demo_id),
                        ("Questions for office hours", "• How do eigenvectors relate to transformations?\n• Which practice problems should I revisit before the quiz?", now.isoformat(timespec="minutes"), demo_id),
                    )
                    resources = (
                        ("Python tutorial", "https://docs.python.org/3/tutorial/", "Article", now.isoformat(timespec="minutes"), demo_id),
                        ("Khan Academy · calculus", "https://www.khanacademy.org/math/calculus-1", "Video", now.isoformat(timespec="minutes"), demo_id),
                    )
                    db.executemany("INSERT INTO tasks(title,priority,done,created,user_id) VALUES(?,?,?,?,?)", tasks)
                    db.executemany("INSERT INTO notes(title,body,created,user_id) VALUES(?,?,?,?)", notes)
                    db.executemany("INSERT INTO resources(title,url,kind,created,user_id) VALUES(?,?,?,?,?)", resources)
                db.execute("INSERT OR REPLACE INTO settings(key,value) VALUES('demo_seeded','1')")
            db.execute("INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)", (f"theme:{demo_id}", "dark"))


initialize_database()


def authenticated(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify(detail="Please sign in to continue."), 401
        g.user_id = user_id
        return view(*args, **kwargs)
    return wrapped


def json_body():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        abort(400, description="Send a JSON object.")
    return data


def required_text(data, key, label, max_length):
    value = data.get(key)
    if not isinstance(value, str) or not value.strip():
        abort(422, description=f"{label} cannot be blank.")
    value = value.strip()
    if len(value) > max_length:
        abort(422, description=f"{label} must be {max_length} characters or fewer.")
    return value


def account_for(user_id):
    with database() as db:
        row = db.execute("SELECT id,name,email FROM users WHERE id=?", (user_id,)).fetchone()
    return dict(row) if row else None


@app.errorhandler(404)
def not_found(error):
    if request.path.startswith("/api/"):
        return jsonify(detail=getattr(error, "description", "Not found.")), 404
    return error


@app.errorhandler(400)
@app.errorhandler(422)
def client_error(error):
    return jsonify(detail=getattr(error, "description", "Invalid request.")), error.code


@app.errorhandler(HTTPException)
def api_http_error(error):
    if request.path.startswith("/api/"):
        return jsonify(detail=error.description), error.code
    return error


@app.get("/")
def home():
    if account_for(session.get("user_id")):
        return render_template("index.html")
    return render_template("auth.html", demo_mode=DEMO_MODE)


@app.get("/api/auth/session")
def auth_session():
    account = account_for(session.get("user_id")) if session.get("user_id") else None
    if not account:
        session.clear()
        return jsonify(authenticated=False)
    return jsonify(authenticated=True, user=account)


@app.put("/api/account")
@authenticated
def update_account():
    data = json_body()
    name = required_text(data, "name", "Your name", 80)
    email = required_text(data, "email", "Email", 254).lower()
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        abort(422, description="Enter a valid email address.")
    with database() as db:
        try:
            db.execute("UPDATE users SET name=?,email=? WHERE id=?", (name, email, g.user_id))
        except sqlite3.IntegrityError:
            abort(409, description="An account with that email already exists.")
    return jsonify(user=account_for(g.user_id))


@app.post("/api/account/password")
@authenticated
def change_account_password():
    data = json_body()
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    if not isinstance(current_password, str) or not isinstance(new_password, str):
        abort(422, description="Enter your current password and a new password.")
    if len(new_password) < 8 or len(new_password) > 128:
        abort(422, description="Use a password between 8 and 128 characters.")
    with database() as db:
        account = db.execute("SELECT password_hash FROM users WHERE id=?", (g.user_id,)).fetchone()
        if not account or not check_password_hash(account["password_hash"], current_password):
            abort(401, description="Your current password is incorrect.")
        db.execute("UPDATE users SET password_hash=? WHERE id=?",
                   (generate_password_hash(new_password, method="pbkdf2:sha256:600000"), g.user_id))
    return jsonify(ok=True)


@app.post("/api/auth/register")
def register():
    data = json_body()
    name = required_text(data, "name", "Your name", 80)
    email = required_text(data, "email", "Email", 254).lower()
    password = data.get("password")
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        abort(422, description="Enter a valid email address.")
    if not isinstance(password, str) or len(password) < 8 or len(password) > 128:
        abort(422, description="Use a password between 8 and 128 characters.")
    with database() as db:
        had_accounts = db.execute("SELECT 1 FROM users LIMIT 1").fetchone() is not None
        previous_theme = db.execute("SELECT value FROM settings WHERE key='theme'").fetchone()
        try:
            cursor = db.execute("INSERT INTO users(name,email,password_hash,created) VALUES(?,?,?,?)",
                                (name, email, generate_password_hash(password, method="pbkdf2:sha256:600000"), datetime.now().isoformat(timespec="minutes")))
        except sqlite3.IntegrityError:
            abort(409, description="An account with that email already exists. Sign in instead.")
        user_id = cursor.lastrowid
        if not had_accounts:
            for table in ("tasks", "notes", "resources"):
                db.execute(f"UPDATE {table} SET user_id=? WHERE user_id IS NULL", (user_id,))
        initial_theme = previous_theme[0] if not had_accounts and previous_theme and previous_theme[0] in ("dark", "light") else "dark"
        db.execute("INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)", (f"theme:{user_id}", initial_theme))
    session.clear()
    session.permanent = True
    session["user_id"] = user_id
    return jsonify(user=account_for(user_id)), 201


@app.post("/api/auth/login")
def login():
    data = json_body()
    email = data.get("email", "")
    password = data.get("password", "")
    if not isinstance(email, str) or not isinstance(password, str):
        abort(422, description="Enter your email and password.")
    with database() as db:
        account = db.execute("SELECT id,password_hash FROM users WHERE email=?", (email.strip().lower(),)).fetchone()
    if not account or not check_password_hash(account["password_hash"], password):
        abort(401, description="That email and password don’t match.")
    session.clear()
    session.permanent = True
    session["user_id"] = account["id"]
    return jsonify(user=account_for(account["id"]))


@app.post("/api/auth/demo-login")
def demo_login():
    if not DEMO_MODE:
        abort(404, description="Demo sign-in is only available in the presentation launcher.")
    with database() as db:
        account = db.execute("SELECT id FROM users WHERE email='demo@uninest.local'").fetchone()
    if not account:
        abort(503, description="The demo account could not be loaded.")
    session.clear()
    session.permanent = True
    session["user_id"] = account["id"]
    return jsonify(user=account_for(account["id"]))


@app.post("/api/auth/logout")
def logout():
    session.clear()
    return jsonify(ok=True)


@app.get("/api/bootstrap")
@authenticated
def bootstrap():
    with database() as db:
        tasks = [dict(row) for row in db.execute("SELECT id,title,priority,done,created FROM tasks WHERE user_id=? ORDER BY done,id DESC", (g.user_id,))]
        notes = [dict(row) for row in db.execute("SELECT id,title,body,created FROM notes WHERE user_id=? ORDER BY id DESC", (g.user_id,))]
        resources = [dict(row) for row in db.execute("SELECT id,title,url,kind,created FROM resources WHERE user_id=? ORDER BY id DESC", (g.user_id,))]
        theme_row = db.execute("SELECT value FROM settings WHERE key=?", (f"theme:{g.user_id}",)).fetchone()
        if not theme_row:
            theme_row = db.execute("SELECT value FROM settings WHERE key='theme'").fetchone()
    return jsonify(tasks=tasks, notes=notes, resources=resources,
                   theme=theme_row[0] if theme_row and theme_row[0] in ("dark", "light") else "dark",
                   user=account_for(g.user_id))


@app.post("/api/tasks")
@authenticated
def create_task():
    data = json_body()
    title = required_text(data, "title", "Task title", 240)
    priority = data.get("priority", "Normal")
    if priority not in ("Normal", "High", "Low"):
        abort(422, description="Choose a valid task priority.")
    with database() as db:
        cursor = db.execute("INSERT INTO tasks(title,priority,created,user_id) VALUES(?,?,?,?)",
                            (title, priority, datetime.now().isoformat(timespec="minutes"), g.user_id))
        row = db.execute("SELECT id,title,priority,done,created FROM tasks WHERE id=? AND user_id=?", (cursor.lastrowid, g.user_id)).fetchone()
    return jsonify(dict(row)), 201


@app.patch("/api/tasks/<int:task_id>")
@authenticated
def toggle_task(task_id):
    with database() as db:
        cursor = db.execute("UPDATE tasks SET done=1-done WHERE id=? AND user_id=?", (task_id, g.user_id))
        row = db.execute("SELECT id,title,priority,done,created FROM tasks WHERE id=? AND user_id=?", (task_id, g.user_id)).fetchone()
    if not cursor.rowcount or row is None:
        abort(404, description="Task not found.")
    return jsonify(dict(row))


@app.delete("/api/tasks/<int:task_id>")
@authenticated
def delete_task(task_id):
    with database() as db:
        cursor = db.execute("DELETE FROM tasks WHERE id=? AND user_id=?", (task_id, g.user_id))
    if not cursor.rowcount:
        abort(404, description="Task not found.")
    return "", 204


@app.post("/api/notes")
@authenticated
def create_note():
    data = json_body()
    title = required_text(data, "title", "Note title", 180)
    body = required_text(data, "body", "Note content", 12000)
    with database() as db:
        cursor = db.execute("INSERT INTO notes(title,body,created,user_id) VALUES(?,?,?,?)",
                            (title, body, datetime.now().isoformat(timespec="minutes"), g.user_id))
        row = db.execute("SELECT id,title,body,created FROM notes WHERE id=? AND user_id=?", (cursor.lastrowid, g.user_id)).fetchone()
    return jsonify(dict(row)), 201


@app.delete("/api/notes/<int:note_id>")
@authenticated
def delete_note(note_id):
    with database() as db:
        cursor = db.execute("DELETE FROM notes WHERE id=? AND user_id=?", (note_id, g.user_id))
    if not cursor.rowcount:
        abort(404, description="Note not found.")
    return "", 204


@app.post("/api/resources")
@authenticated
def create_resource():
    data = json_body()
    title = required_text(data, "title", "Resource name", 180)
    url = required_text(data, "url", "Resource URL", 2000)
    parts = urlparse(url)
    if parts.scheme not in ("http", "https") or not parts.netloc:
        abort(422, description="Enter a complete http:// or https:// link.")
    kind = data.get("kind", "Link")
    if kind not in ("Link", "PDF", "Video", "Article", "Tool"):
        abort(422, description="Choose a valid resource type.")
    with database() as db:
        cursor = db.execute("INSERT INTO resources(title,url,kind,created,user_id) VALUES(?,?,?,?,?)",
                            (title, url, kind, datetime.now().isoformat(timespec="minutes"), g.user_id))
        row = db.execute("SELECT id,title,url,kind,created FROM resources WHERE id=? AND user_id=?", (cursor.lastrowid, g.user_id)).fetchone()
    return jsonify(dict(row)), 201


@app.delete("/api/resources/<int:resource_id>")
@authenticated
def delete_resource(resource_id):
    with database() as db:
        cursor = db.execute("DELETE FROM resources WHERE id=? AND user_id=?", (resource_id, g.user_id))
    if not cursor.rowcount:
        abort(404, description="Resource not found.")
    return "", 204


@app.put("/api/settings/theme")
@authenticated
def set_theme():
    theme = json_body().get("theme")
    if theme not in ("dark", "light"):
        abort(422, description="Choose dark or light theme.")
    with database() as db:
        db.execute("INSERT OR REPLACE INTO settings(key,value) VALUES(?,?)", (f"theme:{g.user_id}", theme))
    return jsonify(theme=theme)


@app.get("/api/export")
@authenticated
def export_data():
    with database() as db:
        theme_row = db.execute("SELECT value FROM settings WHERE key=?", (f"theme:{g.user_id}",)).fetchone()
        content = {
            "app": "UniNest Personal Study Planner",
            "exported_at": datetime.now().isoformat(timespec="seconds"),
            "theme": theme_row[0] if theme_row and theme_row[0] in ("dark", "light") else "dark",
            "tasks": [dict(row) for row in db.execute("SELECT id,title,priority,done,created FROM tasks WHERE user_id=? ORDER BY id", (g.user_id,))],
            "notes": [dict(row) for row in db.execute("SELECT id,title,body,created FROM notes WHERE user_id=? ORDER BY id", (g.user_id,))],
            "resources": [dict(row) for row in db.execute("SELECT id,title,url,kind,created FROM resources WHERE user_id=? ORDER BY id", (g.user_id,))],
        }
    filename = f"uninest_study_planner_{datetime.now():%Y%m%d_%H%M}.json"
    return app.response_class(json.dumps(content, ensure_ascii=False, indent=2),
                              mimetype="application/json",
                              headers={"Content-Disposition": f'attachment; filename="{filename}"'})


@app.post("/api/import")
@authenticated
def import_data():
    data = json_body()
    if data.get("app") not in (None, "UniNest Study Planner", "UniNest Personal Study Planner"):
        abort(422, description="This file is not a UniNest study planner export.")

    imported = {}
    for group in ("tasks", "notes", "resources"):
        rows = data.get(group)
        if not isinstance(rows, list):
            abort(422, description=f"The {group} section must be a list.")
        imported[group] = rows
    if sum(map(len, imported.values())) > 2000:
        abort(422, description="Import files can contain up to 2,000 records.")

    now = datetime.now().isoformat(timespec="minutes")
    tasks, notes, resources = [], [], []
    for row in imported["tasks"]:
        if not isinstance(row, dict):
            abort(422, description="A task entry is invalid.")
        title = required_text(row, "title", "Task title", 240)
        priority = row.get("priority", "Normal")
        done = row.get("done", False)
        if priority not in ("Normal", "High", "Low") or done not in (True, False, 0, 1):
            abort(422, description="A task has an invalid priority or completion value.")
        created = row.get("created", now)
        if not isinstance(created, str) or len(created) > 64:
            abort(422, description="A task date is invalid.")
        tasks.append((title, priority, int(bool(done)), created, g.user_id))
    for row in imported["notes"]:
        if not isinstance(row, dict):
            abort(422, description="A note entry is invalid.")
        title = required_text(row, "title", "Note title", 180)
        body = required_text(row, "body", "Note content", 12000)
        created = row.get("created", now)
        if not isinstance(created, str) or len(created) > 64:
            abort(422, description="A note date is invalid.")
        notes.append((title, body, created, g.user_id))
    for row in imported["resources"]:
        if not isinstance(row, dict):
            abort(422, description="A resource entry is invalid.")
        title = required_text(row, "title", "Resource name", 180)
        url = required_text(row, "url", "Resource URL", 2000)
        parts = urlparse(url)
        kind = row.get("kind", "Link")
        if parts.scheme not in ("http", "https") or not parts.netloc:
            abort(422, description="A resource contains an invalid http:// or https:// link.")
        if kind not in ("Link", "PDF", "Video", "Article", "Tool"):
            abort(422, description="A resource has an invalid type.")
        created = row.get("created", now)
        if not isinstance(created, str) or len(created) > 64:
            abort(422, description="A resource date is invalid.")
        resources.append((title, url, kind, created, g.user_id))

    theme = data.get("theme")
    if theme is not None and theme not in ("dark", "light"):
        abort(422, description="The theme value must be dark or light.")
    with database() as db:
        db.executemany("INSERT INTO tasks(title,priority,done,created,user_id) VALUES(?,?,?,?,?)", tasks)
        db.executemany("INSERT INTO notes(title,body,created,user_id) VALUES(?,?,?,?)", notes)
        db.executemany("INSERT INTO resources(title,url,kind,created,user_id) VALUES(?,?,?,?,?)", resources)
        if theme:
            db.execute("INSERT OR REPLACE INTO settings(key,value) VALUES(?,?)", (f"theme:{g.user_id}", theme))
    return jsonify(added={"tasks": len(tasks), "notes": len(notes), "resources": len(resources)}, theme=theme)
