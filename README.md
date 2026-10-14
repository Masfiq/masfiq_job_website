# masfiq.github.io

Software engineering portfolio for Masfiq Reza. Built with [Astro](https://astro.build), deployed to GitHub Pages.
Fonts: Google Sans (text) and Google Sans Code (tech tags) from Google Fonts, self hosted in `public/fonts/` (SIL Open Font License) so the page paints without waiting on a third party.

## Run locally

Requires Node 22.19 or newer.

```bash
npm install
npm run dev        # http://localhost:4321, reloads on save
npm run build      # production build into dist/, then the copy check
npm run preview    # serve the built dist/ folder
```

## Edit content

All text lives in **`src/data/content.ts`**: hero text, links, projects, experience, skills, education, writing, and contact.
You should not need to touch any layout code.

- **Hero slider:** the rotating project cards come from `showcase` in `content.ts` (steps, chips, and stats per project). Add, remove, or reorder slides there.
- **Hide something until it is ready:** leave a URL as `''` (the GitHub button or link disappears), or set `hidden: true` on an experience entry.
- **Add a project:** copy an object in `projects` (main grid) or `moreProjects` (smaller cards). `icon` can be `pill`, `search`, `code`, `database`, `forest`, `store`, `cube`, or `flame`; `tone` sets the card color.
- **Copy rule:** visible text must not contain em dashes, en dashes, or hyphens. `npm run build` fails and shows the offending line if it does. Proper names that include a hyphen (currently only `scikit-learn`) are allowed in `scripts/check-copy.mjs`.

## Replace the resume

Put the PDF at **`public/resume.pdf`** (exact name). Every "Resume" button links to `/resume.pdf`. Commit and push to publish.
Keep other CV versions in `cv/`; that folder is ignored by Git and never published.

## Add a photo or project screenshots

Put image files in `src/assets/`, then set the file name in `src/data/content.ts`:
`site.photo` for your headshot, `image` and `imageAlt` on a project for a screenshot.
Astro resizes them and converts them to WebP at build time. See `src/assets/README.md`.

## Animations

Animations use [anime.js](https://animejs.com) and live in `src/scripts/motion.ts`: letter by letter name
reveal, a self drawing pipeline diagram with a looping "order" dot, a rippling dot grid in the hero (click to
ripple), scroll linked experience timeline, draggable skill chips that spring back, and scroll reveals.
Elements opt in with data attributes (`data-reveal`, `data-reveal-group`, `data-stagger`, `data-split`,
`data-count`, `data-dotgrid`, `data-timeline`); each function in `motion.ts` can be removed on its own. Visitors who turn on
"reduce motion" in their system settings see the page without animation, and content stays visible if
JavaScript fails to load.

## Link preview image

`public/og-image.png` is what LinkedIn, Handshake, and Slack show when the link is shared. If you change the name or tagline, edit `scripts/make-og.mjs` and run `npm run og`.
LinkedIn caches previews; use the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to refresh it.

## Deploy

1. Create a public GitHub repo named **`masfiq.github.io`** under the `Masfiq` account.
2. Push this folder to its `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/Masfiq/masfiq.github.io.git
   git push -u origin main
   ```
3. In the repo, go to **Settings > Pages > Build and deployment** and set **Source** to **GitHub Actions**.
4. Every push to `main` now builds and deploys automatically (`.github/workflows/deploy.yml`). The site is live at https://masfiq.github.io.

### Custom domain (later)

Add `public/CNAME` containing the domain, change `site` in `astro.config.mjs`, set the domain in Settings > Pages, and add the DNS records GitHub shows you.
