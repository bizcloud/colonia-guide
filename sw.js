const C='colonia-v16', T='colonia-tiles';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!==T).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  if(r.url.includes('tile.openstreetmap.org')){
    e.respondWith(caches.open(T).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>m))));
    return;
  }
  // страница: сначала сеть (свежая версия), без сети — сохранённая
  if(r.mode==='navigate'||r.url.endsWith('/index.html')||r.url.endsWith('/')){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone(); caches.open(C).then(c=>c.put('index.html',cp)); return res}).catch(()=>caches.match('index.html').then(m=>m||caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r)));
});
