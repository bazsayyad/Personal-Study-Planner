"""Cloudflare Workers entry point for UniNest's Flask application."""
import os

# Cloudflare injects bindings through the request WSGI environment, not process env.
os.environ["UNINEST_CLOUDFLARE"] = "1"

from flask import Response, request
from jinja2 import BaseLoader, TemplateNotFound
from pyodide.ffi import run_sync
from workers import wsgi

from app import app


class WorkerSecretMiddleware:
    """Load the cookie-signing secret from a Cloudflare Worker secret binding."""

    def __init__(self, flask_app):
        self.flask_app = flask_app
        # Keep Flask's original WSGI handler before this middleware is assigned
        # to flask_app.wsgi_app; calling flask_app.wsgi_app below would recurse.
        self.wsgi_app = flask_app.wsgi_app

    def __call__(self, environ, start_response):
        worker_env = environ.get("workers.env")
        secret = getattr(worker_env, "UNINEST_SECRET_KEY", None)
        if not secret:
            start_response("503 Service Unavailable", [("Content-Type", "text/plain; charset=utf-8")])
            return [b"UniNest is missing the UNINEST_SECRET_KEY Worker secret."]
        self.flask_app.secret_key = str(secret)
        self.flask_app.config["SESSION_COOKIE_SECURE"] = environ.get("wsgi.url_scheme") == "https"
        return self.wsgi_app(environ, start_response)


class WorkerTemplateLoader(BaseLoader):
    """Load Jinja templates from the Worker's static asset bundle."""

    def get_source(self, environment, template):
        if ".." in template.split("/") or template.startswith("/"):
            raise TemplateNotFound(template)
        assets = request.environ["workers.env"].ASSETS
        response = run_sync(assets.fetch(f"https://assets.local/templates/{template}"))
        if response.status != 200:
            raise TemplateNotFound(template)
        source = run_sync(response.text())
        return source, f"/templates/{template}", lambda: True


def serve_static_asset(filename):
    assets = request.environ["workers.env"].ASSETS
    response = run_sync(assets.fetch(f"https://assets.local/static/{filename}"))
    body = run_sync(response.bytes())
    return Response(body, status=response.status, headers=response.headers)


app.jinja_loader = WorkerTemplateLoader()
app.view_functions["static"] = serve_static_asset
app.wsgi_app = WorkerSecretMiddleware(app)
Default = wsgi.entrypoint(app)
