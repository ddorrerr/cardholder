
const BASE=new URL(self.registration.scope).pathname;
const PREFIX='cardholder-shell-'+BASE+'-';
const CACHE=PREFIX+'b9ec82b90dbd';
const FILES=["","index.html","manifest.webmanifest","icon.svg?v=0.13.1","icon-192.png?v=0.13.1","icon-512.png?v=0.13.1","apple-touch-icon.png?v=0.13.1","cardholder-qr.png","cardholder-qr.svg","assets/Capture-B2OGMLQ7.js","assets/Editor-89iZlrhK.js","assets/Scanner-CMRji9lf.js","assets/index-BxhzRvHP.js","assets/index-CfrFeMga.css","assets/rolldown-runtime-BCiCTKAo.js","assets/src-BmUdCsRu.js"].map(path=>BASE+path);
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method!=='GET'||url.origin!==self.location.origin)return;
  // Never cache Supabase/API responses, private signed URLs, or user photos.
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).catch(()=>caches.match(BASE+'index.html')));return;
  }
  if(FILES.includes(url.pathname+url.search)||FILES.includes(url.pathname)||url.pathname.startsWith(BASE+'ocr/')){
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(response=>{
      if(response.ok){const copy=response.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)));}
      return response;
    })));
  }
});
