const CACHE='futuredev-v2.0.0';
const FILES=['./','./index.html','./assets/styles.css','./assets/ecomfy.css','./assets/account.css','./assets/fonts/space-grotesk.woff2','./assets/orbit-arrow.svg','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png','./manifest.webmanifest','./assets/checker.py','./js/app.js?v=2.0.0','./js/ui.js','./js/views.js?v=2.0.0','./js/curriculum.js','./js/content.js','./js/store.js','./js/runner.js','./js/python-worker.js'];
const PUBLIC_ASSETS=new Set(FILES.map(path=>new URL(path,self.location.href).href));
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(path=>new Request(path,{cache:'reload'})))));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('futuredev-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 // Only public course assets are cached. Never cache Auth/API responses or
 // user data, even if a future endpoint is added under this site's origin.
 if(event.request.method!=='GET'||url.origin!==self.location.origin||(!PUBLIC_ASSETS.has(url.href)&&event.request.mode!=='navigate'))return;
 event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}return response;}).catch(()=>caches.match(event.request).then(cached=>cached|| (event.request.mode==='navigate'?caches.match('./index.html'):Response.error()))));
});
