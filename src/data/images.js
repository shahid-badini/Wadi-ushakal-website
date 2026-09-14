/**
 * Every photo in src/assets/images is resized to several widths and converted to AVIF + WebP at build time
 * (vite-imagetools; widths/formats are set in vite.config.js — lighter WebP-only variants under `npm run dev`).
 * Each import resolves to `{ sources: { avif?, webp }, img: { src, w, h } }` for use with <ResponsivePicture>.
 */
const files = import.meta.glob('../assets/images/*.jpg', {
  eager: true,
  import: 'default',
  query: '?as=picture',
});

export function photo(name) {
  const file = files[`../assets/images/${name}.jpg`];
  if (!file) throw new Error(`Missing image: ${name}.jpg`);
  return file;
}
