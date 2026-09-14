import { ViteSSG } from 'vite-ssg';
// Global styles first, so component (scoped) styles come after them in the cascade
import './styles/global.css';
import App from './App.vue';
import { routes, scrollBehavior } from './router';

// Each route is rendered to static HTML at build time (vite-ssg), then hydrated in the browser.
// In development (`npm run dev`) it runs as a normal client-side Vue app.
export const createApp = ViteSSG(App, { routes, scrollBehavior });
