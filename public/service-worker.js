const CACHE_NAME = 'training-plans-cache';

// Utility function to check for disableCache=true
function hasDisableCache(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.searchParams.get('disableCache') === 'true';
    } catch (e) {
        // If URL parsing fails, default to not disabling cache
        return false;
    }
}

// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             return cache.addAll(urlsToCache);
//         })
//     );
// });

// Activate event: Clean up old caches
// self.addEventListener('activate', (event) => {
//     const cacheWhitelist = [CACHE_NAME];
//     event.waitUntil(
//         caches.keys().then((cacheNames) => {
//             return Promise.all(
//                 cacheNames.map((cacheName) => {
//                     if (!cacheWhitelist.includes(cacheName)) {
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
// });

// Fetch event: Handle requests
self.addEventListener('fetch', (event) => {
    const requestURL = event.request.url;
    if (requestURL.includes('localhost')) {
        return;
    }
    if (event.request.mode !== 'navigate') {
        if (event.request.url.startsWith(self.location.origin)) {
            event.respondWith(
                caches.match(event.request).then((cachedResponse) => {
                    // Serve from cache if available, otherwise fetch from network
                    return cachedResponse || fetch(event.request).then((networkResponse) => {
                        return caches.open(CACHE_NAME).then((cache) => {
                            // Cache the new resource dynamically
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    }).catch(() => {
                        // Optionally provide fallback for offline scenarios
                        // Example: return caches.match('/offline.html');
                    });
                })
            );
        }
        return
    }
    // Determine if cache should be bypassed
    const shouldBypassCache = hasDisableCache(requestURL);

    if (shouldBypassCache) {
        console.log("Bypassing cache for", requestURL);
        // Bypass cache: Fetch directly from the network
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    // Optionally update the cache with the fresh response
                    // Uncomment the following lines if you want to update the cache
                    /*
                    return caches.open(CACHE_NAME).then((cache) => {
                      cache.put(event.request, networkResponse.clone());
                      return networkResponse;
                    });
                    */
                    return networkResponse;
                })
                .catch((error) => {
                    // Handle network errors
                    console.error('Network request failed:', error);
                    // Optionally, serve from cache if available
                    return caches.match(event.request).then((cachedResponse) => {
                        return cachedResponse || new Response('Network error occurred.', {
                            status: 408,
                            statusText: 'Network error',
                        });
                    });
                })
        );
    } else {
        // Use Stale-While-Revalidate strategy

        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request)
                        .then((networkResponse) => {
                            if (networkResponse && networkResponse.status === 200) {
                                cache.put(event.request, networkResponse.clone());
                            }
                            return networkResponse;
                        })
                        .catch((error) => {
                            console.error('Fetch failed:', error);
                            // Optionally, return cachedResponse if network fails
                            return cachedResponse;
                        });

                    // Return cached response immediately if available, else wait for network
                    return cachedResponse || fetchPromise;
                });
            })
        );
    }
});
