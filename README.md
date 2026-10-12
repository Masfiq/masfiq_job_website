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

- **Hide something until it is ready:** leave a URL as `''` (the GitHub button or link disappears), or set `hidden: true` on an experience entry.
- **Add a project:** copy an object in `projects` (main grid) or `moreProjects` (smaller cards). `icon` can be `database`, `forest`, `store`, `cube`, or `flame`.
- **Copy rule:** visible text must not contain em dashes, en dashes, or hyphens. `npm run build` fails and shows the offending line if it does. Proper names that include a hyphen (currently only `scikit-learn`) are allowed in `scripts/check-copy.mjs`.

## Replace the resume

Put the PDF at **`public/resume.pdf`** (exact name). Every "Resume" button links to `/resume.pdf`. Commit and push to publish.

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
