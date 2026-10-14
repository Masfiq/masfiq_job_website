# Images

Put photos and screenshots here, then reference them by file name in `src/data/content.ts`.

| What | Field in content.ts | Suggested size |
|---|---|---|
| Your headshot | `site.photo: 'masfiq.jpg'` | square, at least 600 x 600 |
| Project screenshot | `image: 'harmonizer.png'` and `imageAlt: '...'` on a project | 16:9, at least 1600 x 900 |

Astro resizes and converts these to WebP at build time, so you can drop in full size files.
Do not put screenshots that contain real patient data or private information here.
