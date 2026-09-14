import HomePage from './pages/HomePage.vue';

// Pre-rendered to dist/index.html and dist/contact/index.html at build time (vite-ssg)
export const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/contact', name: 'contact', component: () => import('./pages/ContactPage.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const HEADER_OFFSET = 88; // --header-h + 12px, same as scroll-padding-top in global.css

export function scrollBehavior(to, from, saved) {
  if (saved) return saved;
  if (to.hash) {
    // Section links ("/#services"): glide on the same page, jump straight there when arriving from another page
    const behavior = to.path === from.path ? 'smooth' : 'auto';
    return new Promise((resolve) =>
      requestAnimationFrame(() => resolve({ el: to.hash, top: HEADER_OFFSET, behavior })),
    );
  }
  if (to.path !== from.path) return { top: 0 };
}
