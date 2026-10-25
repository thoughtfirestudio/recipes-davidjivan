const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const RECIPES_DIR = path.join(__dirname, 'recipes');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getMacros(recipe) {
  const r = recipe.recipe || recipe;
  const m = {};
  if (r.macrosPerMeatball) m.perMeatball = r.macrosPerMeatball;
  if (r.macrosPerServing) m.perServing = r.macrosPerServing;
  if (r.macrosPerMuffin) m.perMuffin = r.macrosPerMuffin;
  if (r.macrosPerBite) m.perBite = r.macrosPerBite;
  m.yield = r.yield;
  m.name = r.name;
  m.slug = r.slug;
  return m;
}

app.get('/api/recipes', (req, res) => {
  try {
    const index = readJSON(path.join(RECIPES_DIR, 'index.json'));
    const full = index.map(entry => {
      try {
        const data = readJSON(path.join(RECIPES_DIR, entry.slug + '.json'));
        return { ...entry, macros: getMacros(data) };
      } catch { return entry; }
    });
    res.json(full);
  } catch (e) {
    res.status(500).json({ error: 'failed to load recipes' });
  }
});

app.get('/api/recipes/:slug', (req, res) => {
  const filePath = path.join(RECIPES_DIR, req.params.slug + '.json');
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'not found' });
  try {
    res.json(readJSON(filePath));
  } catch { res.status(500).json({ error: 'failed to load recipe' }); }
});

app.get('/api/recipes/:slug/macros', (req, res) => {
  const filePath = path.join(RECIPES_DIR, req.params.slug + '.json');
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'not found' });
  try {
    const data = readJSON(filePath);
    res.json(getMacros(data));
  } catch { res.status(500).json({ error: 'failed to load macros' }); }
});

app.get('/api/docs', (req, res) => {
  const docsPath = path.join(__dirname, 'API.md');
  if (!fs.existsSync(docsPath)) return res.status(404).json({ error: 'docs not found' });
  const md = fs.readFileSync(docsPath, 'utf8');
  res.set('Content-Type', 'text/markdown; charset=utf-8');
  res.send(md);
});

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log('recipes API on ' + PORT));