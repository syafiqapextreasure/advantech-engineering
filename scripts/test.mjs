import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const base = process.env.TEST_BASE_URL || 'http://localhost:8787';
const context = { window: {} };
vm.runInNewContext(await readFile(new URL('../public/gallery-data.js', import.meta.url), 'utf8'), context);
const photos = context.window.PROJECT_PHOTOS;
assert.equal(photos.length, 161);
assert.equal(new Set(photos.map(p => p.id)).size, 161);
for (const path of ['/', '/index.html', '/about', '/about.html', '/services.html', '/projects.html', '/contact.html', '/project.html?id=building-cabling']) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get('content-type'), /text\/html/);
  const html = await response.text();
  assert.match(html, /id="app"/);
  assert.doesNotMatch(html, /chatgpt\.site/);
  if (path.includes('?')) assert.equal(new URL(response.url).search, '?id=building-cabling');
}
const missing = await fetch(new URL('/missing/nested-page', base));
assert.equal(missing.status, 404);
assert.match(await missing.text(), /Page not found/);
const assets = new Set(['app.js', 'data.js', 'gallery-data.js', 'style.css', 'refinement.css', 'final-polish.css', 'assets/logo.png', 'assets/editorial/about-team-v2.webp']);
for (const photo of photos) {
  assert.ok(photo.title[0] && photo.description[0]);
  assets.add(photo.src);
  assets.add(photo.thumb);
}
const items = [...assets];
for (let index = 0; index < items.length; index += 10) {
  await Promise.all(items.slice(index, index + 10).map(async path => {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200, path);
    assert.ok((await response.arrayBuffer()).byteLength > 0, path);
  }));
}
console.log(`Passed: routes, query strings, custom 404 and ${assets.size} assets including all 161 gallery photos and thumbnails.`);
