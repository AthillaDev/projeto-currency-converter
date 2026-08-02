const CACHE_NAME = "trocca-cache-v1"

const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./manifest.json",
    "./src/main.js",
    "./src/api.js",
    "./src/formatters.js",
    "./src/dom.js",
    "./src/currencyConfig.js",
    "./src/theme.js",
    "./src/inputMask.js",
    "./src/clipboard.js",
    "./src/swipeGesture.js",
    "./src/history.js",
    "./src/chart.js",
    "./assets/icon-192.png",
    "./assets/icon-512.png",
]

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    )
})

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    )
})

self.addEventListener("fetch", (event) => {
    const { request } = event

    // Cotações precisam ser sempre o mais atuais possível: tenta rede primeiro,
    // só cai pro cache se estiver offline.
    if (request.url.includes("awesomeapi.com.br")) {
        event.respondWith(
            fetch(request).catch(() => caches.match(request))
        )
        return
    }

    // Assets estáticos: cache primeiro (mais rápido), busca na rede se não tiver.
    event.respondWith(
        caches.match(request).then((cached) => cached || fetch(request))
    )
})
