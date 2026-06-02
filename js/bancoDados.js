import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
let url = "https://ceqxduuzlknindkmweqa.supabase.co";
let key = "sb_publishable_E_tNhEaToMckJZKCY34TVQ_tQAWQJgy";

export const supabaseCliente = createClient(url, key);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log("Safra 2026: Proteção offline ativa nesta tela."));
  }
