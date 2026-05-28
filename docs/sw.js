const CACHE_NAME = "site-docs-cache-v1";
const OFFLINE_FILES = [
  ".",
  "index.html",
  "manifest.json"
  // add other important file paths here, e.g. "styles.css", "main.js"
];

// Install event: cache site files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_FILES))
  );
});

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
});

// Fetch event: serve cached files, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) =>
        response ||
        fetch(event.request).catch(() =>
          caches.match("index.html")
        )
    )
  );
});
