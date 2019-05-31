const version = '0.1.2'
const cacheName = `satakolkyt-${version}`

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheName).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return (
          response ||
          fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone())
            return response
          })
        )
      })
    })
  )
})
