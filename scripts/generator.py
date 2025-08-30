import json
import shutil
from pathlib import Path
from jinja2 import Environment, FileSystemLoader, select_autoescape


ROOT = Path(__file__).resolve().parent.parent
DIST_DIR = ROOT / "dist"
PROJECTS_SRC = ROOT / "projects"
PROJECTS_DEST = DIST_DIR / "projects"
TEMPLATES_DIR = ROOT / "templates"

env = Environment(
    loader=FileSystemLoader(TEMPLATES_DIR),
    autoescape=select_autoescape(["html", "xml"]),
)


def main():
    """Generate static site under ``dist`` directory."""
    # Clean dist directory
    if DIST_DIR.exists():
        shutil.rmtree(DIST_DIR)
    DIST_DIR.mkdir(parents=True)

    # Copy projects directory
    if PROJECTS_SRC.exists():
        shutil.copytree(PROJECTS_SRC, PROJECTS_DEST)

    # Read metadata
    projects = []
    all_tags = set()

    if PROJECTS_SRC.exists():
        for project_dir in PROJECTS_SRC.iterdir():
            if not project_dir.is_dir():
                continue
            meta_path = project_dir / "meta.json"
            if not meta_path.exists():
                continue
            try:
                meta = json.loads(meta_path.read_text(encoding="utf-8"))
            except Exception as err:  # pragma: no cover - log parse errors
                print(f"Skipping project '{project_dir.name}': {err}")
                continue

            cover_file = project_dir / "assets" / "cover.png"
            cover = (
                f"projects/{project_dir.name}/assets/cover.png"
                if cover_file.exists()
                else "https://placehold.co/400x300/eee/31343C?text=Resim+Yok"
            )

            tags = meta.get("tags", [])
            all_tags.update(tags)

            projects.append(
                {
                    **meta,
                    "dir": project_dir.name,
                    "cover": cover,
                    "tags": tags,
                }
            )

    index_html = generate_index(projects, sorted(all_tags))
    (DIST_DIR / "index.html").write_text(index_html, encoding="utf-8")


def generate_index(projects, tags):
    """Render index.html using Jinja2 template."""
    template = env.get_template("index.html.jinja")
    return template.render(projects=projects, tags=tags)


if __name__ == "__main__":
    main()

