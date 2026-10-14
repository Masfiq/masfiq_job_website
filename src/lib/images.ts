import type { ImageMetadata } from 'astro';

// Every image in src/assets/, keyed by file name ('masfiq.jpg' -> metadata).
const files = import.meta.glob<ImageMetadata>('../assets/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

const byName = new Map(Object.entries(files).map(([path, img]) => [path.split('/').pop()!, img]));

/** Look up an image by file name. Returns undefined (and warns at build time) if missing. */
export function getImage(name?: string): ImageMetadata | undefined {
  if (!name) return undefined;
  const img = byName.get(name);
  if (!img) console.warn(`[images] "${name}" not found in src/assets/. Check the file name in content.ts.`);
  return img;
}
