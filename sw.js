const C='colonia-v5', T='colonia-tiles';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  if(r.url.includes('tile.openstreetmap.org')){
    e.respondWith(caches.open(T).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>m))));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).catch(()=>caches.match('index.html'))));
});
