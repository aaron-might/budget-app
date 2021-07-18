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
})