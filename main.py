"""Launch the local UniNest browser app."""
from threading import Timer
import webbrowser

from app import app


if __name__ == "__main__":
    Timer(1.0, lambda: webbrowser.open("http://127.0.0.1:8000")).start()
    app.run(host="127.0.0.1", port=8000, debug=False)
