'use strict';

const CACHE_VERSION = 'v8';
const CACHE_NAME = `pwa-ordersys-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon.png',
  './menu.json',
  './lists.json',
  './orders.json',
  './banner.jpeg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Navigation requests: network-first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Static assets: stale-while-revalidate —
  // 立刻回缓存（秒开），同时后台拉最新版写入缓存，下次打开即是新版
  if (request.url.includes(self.location.origin)) {
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        }).catch(() => cached); // 离线时仍回缓存
        return cached || network;
      })
    );
    return;
  }

  // External requests (e.g. EmailJS CDN): network-only
  event.respondWith(fetch(request));
});
