// Service worker: guarda una copia de toda la app para que funcione 100% sin
// conexión, pero SIEMPRE intenta primero traer la versión más nueva de
// internet — solo usa la copia guardada cuando de verdad no hay señal
// (como dentro del penal). Así las actualizaciones se ven apenas hay wifi/datos.
const CACHE_NAME = 'legionarios-v4';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './xlsx.full.min.js',
  './firebase-compat-bundle.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Estrategia: red primero (para tener siempre lo último apenas hay señal),
// y si falla por falta de conexión, recién ahí usa la copia guardada.
// Ojo: esto es solo para los archivos propios de la app (mismo origen). Los
// pedidos a Firebase/Firestore (sincronización en la nube) se dejan pasar
// sin tocar, para no interferir con su propia cola de reintentos offline.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request).then((resp) => {
      const respClone = resp.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
      return resp;
    }).catch(() => caches.match(event.request))
  );
});
