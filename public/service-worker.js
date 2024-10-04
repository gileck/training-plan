// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open('my-cache').then((cache) => {
//             console.log({ cache });
//             return cache.addAll([
//                 // Cache all JS files
//                 '/*.js' // This is a placeholder; you may need to specify actual file paths
//             ]);
//         })
//     );
// });

// //listen to js files load events
// self.addEventListener('fetch', (event) => {
//     console.log({ event });
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             return response || fetch(event.request);
//         })
//     );
// });