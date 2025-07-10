const CACHE_NAME = 'mycards-cache-v1';

// 缓存所有核心文件，确保离线可用

const urlsToCache = [

  './', // 缓存根路径，即 index.html

  './index.html',

  './manifest.json',

  './service-worker.js'

  // 如果你将来添加了 icon-192.png 和 icon-512.png，也请在这里添加它们的路径

  // './icon-192.png',

  // './icon-512.png'

];



// 安装 Service Worker 并缓存所有资源

self.addEventListener('install', event => {

  event.waitUntil(

    caches.open(CACHE_NAME)

      .then(cache => {

        console.log('Opened cache');

        return cache.addAll(urlsToCache);

      })

  );

});



// 拦截网络请求，优先从缓存中获取资源

self.addEventListener('fetch', event => {

  event.respondWith(

    caches.match(event.request)

      .then(response => {

        // 如果缓存中有，则返回缓存的资源

        if (response) {

          return response;

        }

        // 否则，从网络获取资源

        return fetch(event.request);

      })

  );

});



// 激活 Service Worker，清理旧的缓存

self.addEventListener('activate', event => {

  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(

    caches.keys().then(cacheNames => {

      return Promise.all(

        cacheNames.map(cacheName => {

          if (cacheWhitelist.indexOf(cacheName) === -1) {

            console.log('Deleting old cache:', cacheName);

            return caches.delete(cacheName);

          }

        })

      );

    })

  );

});
