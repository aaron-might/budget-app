const FILES_TO_CACHE =[
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/assets/images/icons/icon-192x192.png'
];

const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache =>{
            console.log('Your files were successfully pre-cached!');
            return cache.addAll(FILES_TO_CACHE);
        })
);
self.skipWaiting();
});

// activate service worker
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('Removing old cache data', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

