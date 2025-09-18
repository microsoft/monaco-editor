const CACHE = "switch-cache-v1";
const ASSETS = [
	"/",
	"/index.html",
	"/playground.html",
	"/monarch.html",
	"/switch.html",
];
self.addEventListener("install", (e) => {
	e.waitUntil(
		caches
			.open(CACHE)
			.then((c) => c.addAll(ASSETS))
			.then(() => self.skipWaiting())
	);
});
self.addEventListener("activate", (e) => {
	e.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
				)
			)
			.then(() => self.clients.claim())
	);
});
self.addEventListener("fetch", (e) => {
	const url = new URL(e.request.url);
	if (url.origin === location.origin) {
		e.respondWith(
			caches.match(e.request).then(
				(r) =>
					r ||
					fetch(e.request)
						.then((resp) => {
							if (
								e.request.method === "GET" &&
								resp.ok &&
								resp.type === "basic"
							) {
								const clone = resp.clone();
								caches
									.open(CACHE)
									.then((c) => c.put(e.request, clone));
							}
							return resp;
						})
						.catch(() => caches.match("/index.html"))
			)
		);
	}
});
