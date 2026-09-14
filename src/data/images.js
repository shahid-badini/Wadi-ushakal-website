/**
 * Every photo in src/assets/images is resized to several widths and converted to AVIF + WebP at build time
 * (vite-imagetools; widths/formats are set in vite.config.js — lighter WebP-only variants under `npm run dev`).
 * Each import resolves to `{ sources: { avif?, webp }, img: { src, w, h } }` for use with <ResponsivePicture>.
 */
const files = import.meta.glob('../assets/images/*.{jpg,png}', {
  eager: true,
  import: 'default',
  query: '?as=picture',
});

export function photo(name) {
  // most photos are .jpg; the hero artwork is a .png, so both extensions are looked up
  const file = files[`../assets/images/${name}.jpg`] ?? files[`../assets/images/${name}.png`];
  if (!file) throw new Error(`Missing image: ${name}.jpg / ${name}.png`);
  return file;
}
