const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const projectsSrc = path.join(__dirname, '..', 'projects');
const projectsDest = path.join(distDir, 'projects');

// Clean dist directory
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

// Copy projects directory
fs.mkdirSync(projectsDest, { recursive: true });
if (fs.existsSync(projectsSrc)) {
  fs.cpSync(projectsSrc, projectsDest, { recursive: true });
}

// Read metadata
const projectDirs = fs.existsSync(projectsSrc)
  ? fs.readdirSync(projectsSrc, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
  : [];

const projects = [];

for (const dir of projectDirs) {
  const metaPath = path.join(projectsSrc, dir, 'meta.json');
  if (!fs.existsSync(metaPath)) continue;
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const coverFile = path.join(projectsSrc, dir, 'assets', 'cover.png');
    const cover = fs.existsSync(coverFile)
      ? `projects/${dir}/assets/cover.png`
      : 'https://placehold.co/400x300/eee/31343C?text=Resim+Yok';
    projects.push({ ...meta, dir, cover });
  } catch (err) {
    console.error(`Skipping project '${dir}': ${err.message}`);
  }
}

// Generate index.html
const indexHtml = generateIndex(projects);
fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml, 'utf8');

// Generate developer pages
if (projects.length > 0) {
  const devDir = path.join(distDir, 'developers');
  fs.mkdirSync(devDir, { recursive: true });
  const byAuthor = {};
  for (const p of projects) {
    byAuthor[p.author] = byAuthor[p.author] || [];
    byAuthor[p.author].push(p);
  }
  for (const [author, list] of Object.entries(byAuthor)) {
    const html = generateDeveloper(author, list);
    fs.writeFileSync(path.join(devDir, `${author}.html`), html, 'utf8');
  }
}

function generateIndex(projects) {
  const cards = projects.map(p => `
      <div class="card" data-type="${p.type}" data-age="${p.age_range}">
        <a href="projects/${p.dir}/index.html">
          <img src="${p.cover}" alt="${p.title} kapak">
        </a>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <p class="meta">Tür: ${p.type} | Yaş: ${p.age_range}</p>
        <p class="author">Yazar: <a href="developers/${p.author}.html">${p.author}</a></p>
      </div>`).join('\n');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>Çocuklar İçin Projeler</title>
<style>
body{font-family:sans-serif;padding:20px;}
.filters{margin-bottom:20px;}
.card{border:1px solid #ddd;padding:10px;margin:10px;width:300px;display:inline-block;vertical-align:top;background:#fff;}
.card img{width:100%;height:auto;}
</style>
</head>
<body>
<h1>Çocuklar İçin Projeler</h1>
<div class="filters">
  <label>Tür:
    <select id="typeFilter">
      <option value="">Hepsi</option>
      <option>Oyun</option>
      <option>Araç</option>
      <option>Etkinlik</option>
      <option>Hikaye</option>
      <option>Eğitici</option>
    </select>
  </label>
  <label>Yaş:
    <select id="ageFilter">
      <option value="">Hepsi</option>
      <option>3-5</option>
      <option>6-8</option>
      <option>9-12</option>
      <option>Tümü</option>
    </select>
  </label>
</div>
<div id="projects">
${cards || '<p>Henüz proje eklenmedi.</p>'}
</div>
<script>
const typeFilter=document.getElementById('typeFilter');
const ageFilter=document.getElementById('ageFilter');
const cards=Array.from(document.querySelectorAll('.card'));
function applyFilters(){
  const t=typeFilter.value;
  const a=ageFilter.value;
  cards.forEach(c=>{
    const show=(!t||c.dataset.type===t)&&(!a||c.dataset.age===a);
    c.style.display=show?'inline-block':'none';
  });
}
typeFilter.addEventListener('change',applyFilters);
ageFilter.addEventListener('change',applyFilters);
</script>
</body>
</html>`;
}

function generateDeveloper(author, projects){
  const cards = projects.map(p => `
    <div class="card">
      <a href="../projects/${p.dir}/index.html">
        <img src="../${p.cover}" alt="${p.title} kapak">
      </a>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <p class="meta">Tür: ${p.type} | Yaş: ${p.age_range}</p>
    </div>`).join('\n');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>${author} - Projeleri</title>
<style>
body{font-family:sans-serif;padding:20px;}
.card{border:1px solid #ddd;padding:10px;margin:10px;width:300px;display:inline-block;vertical-align:top;background:#fff;}
.card img{width:100%;height:auto;}
</style>
</head>
<body>
<h1>${author}</h1>
<div>
${cards || '<p>Bu geliştirici henüz proje eklemedi.</p>'}
</div>
<p><a href="../index.html">← Ana sayfa</a></p>
</body>
</html>`;
}
