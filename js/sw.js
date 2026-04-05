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
  './CSS/style.css', // Verifique se o nome da pasta é CSS ou css
  './js/bancoDados.js',
  './js/lancarSacas.js',
  './js/login.js',
  './js/cadastrarApanhadores.js',
  './js/cadastrarProdutor.js',
  './js/supaBaseLib.js',
  './js/sacas.js',
  './js/relatorios.js',
  './js/enviarRelatorio.js',
  './js/proximoPasso.js',
  './js/redefinirSenha.js',
  './js/atualizarSenha.js',
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

// 3. Estratégia: Tenta a rede, se falhar (offline), usa o cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});