# Advantech Engineering

Responsive English/Bahasa Melayu website for Advantech Engineering Sdn. Bhd., with separate Home, About, Services, Projects and Contact pages and 161 original project photographs.

## Cloudflare Workers deployment

This uses [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/). Cloudflare serves the HTML, JavaScript, CSS and images directly; no Node server, database, KV binding or custom Worker script is needed.

1. In Cloudflare **Workers & Pages**, create a Worker and import this GitHub repository.
2. Choose the `main` branch and repository root `/`.
3. Set **Build command** to `npm run build`, or leave it blank. The committed `public/` directory is ready to deploy; building only prepares optional domain metadata.
4. Set **Deploy command** to `npx wrangler deploy`.
5. Keep the Worker name `advantech-engineering` (or change it in `wrangler.jsonc` to match).
6. Deploy. Cloudflare assigns the actual `workers.dev` URL; add a custom domain in the Worker's settings if desired.

Optional: set the build environment variable `SITE_URL` to your actual HTTPS origin (e.g. `https://your-domain.com`) and rebuild to generate a sitemap and absolute social image URLs. No domain is assumed by default.

For deployment from your own terminal with Node.js 22 or newer:

```sh
npm ci
npx wrangler login
npm run deploy
```

## Develop and verify

```sh
npm ci
npm run check
npm run dev
```

Wrangler serves the site locally at `http://localhost:8787`. In another terminal run `npm test` to verify routes, all gallery images, page resources, query-string routing and the 404 response against the Workers runtime. Set `TEST_BASE_URL` to test another local address.

Cloudflare redirects `.html` links to their clean equivalents, preserving query strings. Both forms work. Unknown routes return a real 404 rather than the homepage.

## Editing

- `public/app.js`: page content, navigation and interactions.
- `public/data.js`: company contact details and service categories.
- `public/gallery-data.js`: all original project titles, descriptions and categories.
- `public/assets/`: website photography, logo, original gallery images and thumbnails.
- `public/style.css`, `refinement.css`, `final-polish.css`: responsive styles.
- `scripts/build.mjs`: prepares optional domain metadata directly in `public/`.
- `wrangler.jsonc`: deployment configuration.

The enquiry form opens a draft WhatsApp message to +60 17-953 2690; the visitor sends it in WhatsApp. There is no server-side form storage or email delivery. The contact page embeds the supplied Puchong store address in Google Maps. Generated editorial photography is used on marketing pages; the project gallery retains original site photographs.
