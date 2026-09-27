# UniNest — Personal Study Planner

The planner runs as a local Python web app. Flask serves the browser interface and handles the planner API; SQLite keeps the data in `study_planner.db` on this computer.

## Start the app

On Windows, double-click `run_app.bat`. The first launch creates a project-local `.venv`, installs Flask from `requirements.txt`, and opens the planner at `http://127.0.0.1:8000`. Keep the terminal window open while you use it; close the window to stop the local server.

For a classroom presentation, double-click `run_demo.bat`. It opens a separate, compact demo database with a few sample tasks, notes, and resources. Your personal planner database is not changed.

On the regular launcher, choose **Create account** the first time you open UniNest, then use that email and password on later visits. Passwords are stored as hashes. The first account adopts existing unassigned planner rows so your current tasks, notes, and resources stay available. In the demo launcher, choose **Explore the demo space** for one-click access.

You can also launch it from a terminal with `python main.py` after installing the requirements in your environment.

## Included

- Dashboard with task progress and quick-add
- Tasks with priority, completion, search, filters, and delete
- Notes and study resources
- Focus timer with 15, 25, and 50 minute presets
- Persistent warm dark and light themes
- JSON data export
- Subtle button sounds, custom cursor, and reduced-motion support
- Local sign-in and registration, with separate planner data per account

The old Tkinter implementation is kept in `legacy_desktop.py` for reference. Existing planner rows are preserved and assigned to the first account you register.
