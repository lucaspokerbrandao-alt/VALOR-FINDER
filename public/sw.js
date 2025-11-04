const CACHE_NAME = 'valor-finder-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Evento de instalação: abre o cache e armazena os ativos do app.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Evento de ativação: limpa caches antigos.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de fetch: intercepta as requisições e serve do cache primeiro.
self.addEventListener('fetch', event => {
  // Ignora requisições que não são GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Estratégia: Cache-first para os recursos do app.
  // Para outras requisições (ex: API do Gemini), a rede será usada.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o recurso estiver no cache, retorna-o.
        if (response) {
          return response;
        }

        // Se não, busca na rede.
        return fetch(event.request).then(
          networkResponse => {
            // Não armazena em cache respostas de API ou de CDNs dinâmicas para evitar problemas.
            // O service worker foca no "app shell".
            return networkResponse;
          }
        );
      })
  );
});
