"""Copy Flask templates and static files into the Cloudflare asset directory."""
from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / "cloudflare_assets"

for folder in ("static", "templates"):
    shutil.copytree(ROOT / folder, DESTINATION / folder, dirs_exist_ok=True)

print(f"Cloudflare assets prepared in {DESTINATION}")
