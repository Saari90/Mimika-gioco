/* Service worker di MIMIKA (generato in fase di build da vite.config.ts: non modificare dist/sw.js).
 * - install: mette in cache tutti i file della build (elenco PRECACHE) => il gioco funziona offline;
 * - pagine: rete prima (aggiornamenti subito), cache se offline;
 * - file con hash nel nome: cache prima (non cambiano mai).
 * I link #c= #r= #o= #a= non sono un problema: il frammento dopo # non arriva mai al service worker,
 * la pagina servita è sempre index.html e il routing resta in Game.routeHash().
 * Il duello live usa WebRTC (non passa da fetch) e non è toccato.
 */
const CACHE = 'mimika-52473269d9';
const PRECACHE = [
  "./",
  "./assets/index-C_woood3.js",
  "./assets/esm-B2YG3EcB.js",
  "./assets/esm-CBOIRuZK.js",
  "./assets/esm-Cpd_6ygF.js",
  "./assets/esm-lL7lYfkS.js",
  "./assets/web-0FLlKGE_.js",
  "./assets/web-CjpRvVUJ.js",
  "./assets/web-DyLE0XqN.js",
  "./assets/fredoka-latin-400-normal-17JuUzdy.woff2",
  "./assets/fredoka-latin-500-normal-B0JifZgm.woff2",
  "./assets/fredoka-latin-600-normal-C4zohCW5.woff2",
  "./assets/fredoka-latin-700-normal-BOIZVyIN.woff2",
  "./assets/index-BLP71N2I.css",
  "./favicon.svg",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/icon.svg",
  "./manifest.webmanifest",
  "./privacy/index.html",
  "./promo/index.html"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('mimika-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    // ogni pagina (gioco, promo/, privacy/) in cache col proprio indirizzo: la promo non deve sostituire il gioco offline
    const scope = self.registration.scope;
    const isGame = req.url.split(/[?#]/)[0] === scope || req.url.split(/[?#]/)[0] === scope + 'index.html';
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(isGame ? './' : req, copy));
          }
          return res;
        })
        .catch(() => caches.match(isGame ? './' : req, { ignoreSearch: true }).then((r) => r || caches.match('./'))),
    );
    return;
  }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) =>
      hit ||
      fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })),
  );
});
