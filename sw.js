const CACHE_NAME = 'safra-2026-v1';

// Lista de TODOS os seus arquivos para o cache
const assets = [
  './',
  './index.html',
  './painelProdutor.html',
  './cadastrarProdutor.html',
  './atualizarSenha.html',
  './alterarSenha.html',
  './manifest.json',
  './CSS/style.css', 
  './bancoDados.js',
  './lancarSacas.js',
  './login.js',
  './cadastrarApanhadores.js',
  './cadastrarProdutor.js',
  './supaBaseLib.js',
  './sacas.js',
  './relatorios.js',
  './enviarRelatorio.js',
  './proximoPasso.js',
  './redefinirSenha.js',
  './atualizarSenha.js',
  './icone-192.png',
  './icone-512.png'
];

// 1. Instalação: Salva tudo no navegador
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Safra 2026: Cacheando arquivos...');
      return cache.addAll(assets);
    })
  );
});

// 2. Ativação: Limpa caches antigos se você atualizar o app
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. Estratégia: Cache First (Entrega o que está no celular na hora!)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Se tiver no cache, manda ver. Se não, tenta baixar da rede.
      return response || fetch(e.request);
    })
  );
});