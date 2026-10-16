import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../public/', import.meta.url);
const context = { window: {} };
for (const file of ['data.js', 'gallery-data.js']) {
  vm.runInNewContext(await readFile(new URL(file, root), 'utf8'), context);
}
assert.equal(context.window.PROJECT_PHOTOS.length, 161);
const assets = new Set();
for (const photo of context.window.PROJECT_PHOTOS) {
  assert.ok(photo.title[0] && photo.description[0]);
  assets.add(photo.src);
  assets.add(photo.thumb);
}
for (const service of context.window.SERVICES) assets.add(`assets/editorial/${service.id}.webp`);
assets.add('assets/editorial/hero.webp');
assets.add('assets/editorial/about-team-v2.webp');
for (const page of ['index', 'about', 'services', 'projects', 'project', 'contact']) {
  const html = await readFile(new URL(`${page}.html`, root), 'utf8');
  assert.doesNotMatch(html, /chatgpt\.site|localhost/);
  for (const [, path] of html.matchAll(/(?:src|href)="([^"#:]+)"/g)) {
    if (!path.startsWith('http')) assets.add(path.split('?')[0]);
  }
}
for (const path of assets) assert.ok((await stat(new URL(path.replace(/^\//, ''), root))).size > 0, path);
assert.match(await readFile(new URL('404.html', root), 'utf8'), /href="\/"/);
console.log(`Validated six pages, 161 gallery records and ${assets.size} local asset references.`);
