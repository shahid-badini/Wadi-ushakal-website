import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { imagetools } from 'vite-imagetools';

// Photo variants (see src/data/images.js). The build makes AVIF + WebP at four widths.
// The dev server makes WebP only at two widths: AVIF encoding is slow, and doing it on demand left the
// photos blank for ~20 s on first load under `npm run dev`.
const PHOTOS_BUILD = 'w=480;800;1200;1800&format=avif;webp';
const PHOTOS_DEV = 'w=800;1600&format=webp';
let serving = false;

export default defineConfig({
  plugins: [
    { name: 'wn-command', configResolved: (config) => (serving = config.command === 'serve') },
    vue(),
    imagetools({
      defaultDirectives: (url) =>
        new URLSearchParams(url.searchParams.get('as') === 'picture' ? (serving ? PHOTOS_DEV : PHOTOS_BUILD) : ''),
    }),
  ],
  server: {
    // Always http://127.0.0.1:5173 — .vscode/launch.json (F5) and the "Go Live" helper in index.html expect this address
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    // Running `npm run build` while `npm run dev` is open writes these folders; ignoring them stops the dev page reloading
    watch: { ignored: ['**/dist/**', '**/.vite-ssg-temp/**'] },
  },
  build: {
    // The Three.js hero chunk (~145 kB gzip) is loaded lazily after first paint, so its size is intentional.
    chunkSizeWarningLimit: 700,
    cssCodeSplit: false,
  },
  // Pre-bundle the lazily imported 3D dependencies so the dev server never serves a stale optimised copy.
  optimizeDeps: {
    include: [
      'three',
      'three/examples/jsm/geometries/RoundedBoxGeometry.js',
      'three/examples/jsm/utils/BufferGeometryUtils.js',
    ],
  },
  // vite-ssg: pre-renders the Vue app to static HTML at build time, then hydrates it in the browser.
  ssgOptions: {
    script: 'async',
    formatting: 'none',
    // /contact → dist/contact/index.html, so it works on any static host (and Live Server) without rewrites
    dirStyle: 'nested',
  },
});
