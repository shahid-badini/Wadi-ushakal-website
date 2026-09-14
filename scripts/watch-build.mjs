// Keeps dist/ up to date for VS Code "Go Live": rebuilds on every save in src/, public/ or the config files.
// Live Server (root: dist/, see .vscode/settings.json) then reloads the browser by itself.
import { watch } from 'node:fs';
import { spawn } from 'node:child_process';

const watched = ['src', 'public', 'index.html', '.env', 'vite.config.js'];
let running = false;
let queued = false;
let timer;

function build() {
  if (running) return void (queued = true);
  running = true;
  const start = Date.now();
  const child = spawn('npm', ['run', 'build', '--silent'], { stdio: ['ignore', 'ignore', 'inherit'] });
  child.on('exit', (code) => {
    running = false;
    console.log(code === 0 ? `✓ dist/ updated in ${Date.now() - start} ms` : '✗ Build failed — see the error above');
    if (queued) {
      queued = false;
      build();
    }
  });
}

for (const path of watched) {
  watch(path, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(build, 300);
  });
}
console.log('Watching for changes — keep "Go Live" open, it reloads after each build.');
build();
