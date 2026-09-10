const CACHE='field-notes-v10';
const CORE=['./','./index.html','./app.js?v=10','./styles.css?v=10','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./art/floral-border.webp','./art/today.webp','./art/research-companion.webp','./art/supervisor.webp','./art/literature.webp','./art/diary.webp','./art/brain-dump.webp','./art/weekly.webp','./art/weekly-mentor.webp','./art/advice.webp','./art/fieldwork.webp','./art/analysis.webp','./art/progress.webp','./art/future-steph.webp'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;
  const isFreshAsset=event.request.mode==='navigate'||/\/(?:app\.js|styles\.css|index\.html)$/.test(url.pathname);
  if(isFreshAsset){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;})));
});
