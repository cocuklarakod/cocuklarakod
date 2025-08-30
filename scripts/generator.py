import json
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DIST_DIR = ROOT / "dist"
PROJECTS_SRC = ROOT / "projects"
PROJECTS_DEST = DIST_DIR / "projects"


def main():
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

            projects.append({
                **meta,
                "dir": project_dir.name,
                "cover": cover,
                "tags": tags,
            })

    index_html = generate_index(projects, sorted(all_tags))
    (DIST_DIR / "index.html").write_text(index_html, encoding="utf-8")


def generate_index(projects, tags):
    tag_options = "\n".join(f"      <option>{t}</option>" for t in tags)

    cards = []
    for p in projects:
        tag_attr = ",".join(p["tags"])
        tags_line = ", ".join(p["tags"]) if p["tags"] else "-"
        cards.append(
            f"""
      <div class=\"card\" data-type=\"{p['type']}\" data-age=\"{p['age_range']}\" data-tags=\"{tag_attr}\">
        <a href=\"projects/{p['dir']}/index.html\">
          <img src=\"{p['cover']}\" alt=\"{p['title']} kapak\">
        </a>
        <h3>{p['title']}</h3>
        <p>{p['description']}</p>
        <p class=\"meta\">Tür: {p['type']} | Yaş: {p['age_range']}</p>
        <p class=\"tags\">Etiketler: {tags_line}</p>
        <p class=\"author\">Yazar: <a href=\"https://github.com/{p['author']}\" target=\"_blank\" rel=\"noopener noreferrer\">{p['author']}</a></p>
      </div>"""
        )

    cards_html = "\n".join(cards) if cards else "<p>Henüz proje eklenmedi.</p>"

    return f"""<!DOCTYPE html>
<html lang=\"tr\">
<head>
<meta charset=\"UTF-8\">
<title>Çocuklar İçin Projeler</title>
<style>
body{{font-family:'Segoe UI',sans-serif;padding:20px;background:#f0f2f5;color:#333;}}
h1{{text-align:center;margin-bottom:30px;}}
.filters{{margin-bottom:20px;text-align:center;}}
#projects{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;}}
.card{{border:1px solid #ddd;padding:15px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);background:#fff;}}
.card img{{width:100%;height:auto;border-radius:4px;}}
.author a{{text-decoration:none;color:#0366d6;}}
.tags{{font-size:0.9em;color:#555;}}
</style>
</head>
<body>
<h1>Çocuklar İçin Projeler</h1>
<div class=\"filters\">
  <label>Tür:
    <select id=\"typeFilter\">
      <option value=\"\">Hepsi</option>
      <option>Oyun</option>
      <option>Araç</option>
      <option>Etkinlik</option>
      <option>Hikaye</option>
      <option>Eğitici</option>
    </select>
  </label>
  <label>Yaş:
    <select id=\"ageFilter\">
      <option value=\"\">Hepsi</option>
      <option>3-5</option>
      <option>6-8</option>
      <option>9-12</option>
      <option>Tümü</option>
    </select>
  </label>
  <label>Etiket:
    <select id=\"tagFilter\">
      <option value=\"\">Hepsi</option>
{tag_options}
    </select>
  </label>
</div>
<div id=\"projects\">
{cards_html}
</div>
<script>
const typeFilter=document.getElementById('typeFilter');
const ageFilter=document.getElementById('ageFilter');
const tagFilter=document.getElementById('tagFilter');
const cards=Array.from(document.querySelectorAll('.card'));
function applyFilters(){{
  const t=typeFilter.value;
  const a=ageFilter.value;
  const tag=tagFilter.value;
  cards.forEach(c=>{{
    const tags=c.dataset.tags?c.dataset.tags.split(','):[];
    const show=(!t||c.dataset.type===t)&&(!a||c.dataset.age===a)&&(!tag||tags.includes(tag));
    c.style.display=show?'block':'none';
  }});
}}
typeFilter.addEventListener('change',applyFilters);
ageFilter.addEventListener('change',applyFilters);
tagFilter.addEventListener('change',applyFilters);
</script>
</body>
</html>
"""


if __name__ == "__main__":
    main()

