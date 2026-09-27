@echo off
cd /d "%~dp0"
if not exist ".venv\Scripts\python.exe" if not exist ".venv\bin\python.exe" python -m venv .venv
set "PLANNER_PY=.venv\Scripts\python.exe"
if not exist "%PLANNER_PY%" set "PLANNER_PY=.venv\bin\python.exe"
"%PLANNER_PY%" -c "import flask" >nul 2>&1
if errorlevel 1 "%PLANNER_PY%" -m pip install -r requirements.txt
if errorlevel 1 goto setup_failed
set "UNINEST_DB=study_planner_demo.db"
set "UNINEST_DEMO=1"
"%PLANNER_PY%" main.py
pause
exit /b

:setup_failed
echo Could not install the app requirements. Check your internet connection and try again.
pause
