import { readFile, writeFile, readdir, rm } from 'node:fs/promises';

const output = new URL('../public/', import.meta.url);
// The checked-in website is deployable without running this optional metadata step.
await rm(new URL('sitemap.xml', output), { force: true });
await writeFile(new URL('robots.txt', output), 'User-agent: *\nAllow: /\n');
for (const name of await readdir(output)) {
  if (!name.endsWith('.html')) continue;
  const file = new URL(name, output);
  const html = await readFile(file, 'utf8');
  await writeFile(file, html.replace(/content="https?:\/\/[^"\s]+\/assets\/building-cabling-01\.webp"/g, 'content="/assets/building-cabling-01.webp"'));
}

// Set SITE_URL in Cloudflare Builds once a workers.dev or custom domain is known.
// Without it, no sitemap or absolute social URL is invented.
const configuredUrl = process.env.SITE_URL;
if (configuredUrl) {
  const url = new URL(configuredUrl);
  if (!['https:', 'http:'].includes(url.protocol) || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('SITE_URL must be an HTTP(S) origin, e.g. https://example.com');
  }
  const origin = url.origin;
  const pages = ['/', '/about', '/services', '/projects', '/contact'];
  await writeFile(new URL('sitemap.xml', output), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + pages.map(path => `<url><loc>${origin}${path}</loc></url>`).join('') + '</urlset>\n');
  await writeFile(new URL('robots.txt', output), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  for (const name of await readdir(output)) {
    if (!name.endsWith('.html')) continue;
    const file = new URL(name, output);
    const html = await readFile(file, 'utf8');
    await writeFile(file, html.replace('content="/assets/building-cabling-01.webp"', `content="${origin}/assets/building-cabling-01.webp"`));
  }
}
console.log('Website ready in public/');
