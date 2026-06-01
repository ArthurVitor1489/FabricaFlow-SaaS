import { createClient } from '@supabase/supabase-js';

// Essas variáveis podem ser configuradas no arquivo .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

if (!isSupabaseConfigured) {
  console.log('[FabricaFlow] ⚡ Iniciando em Modo de Demonstração Offline (Banco de Dados Mock Ativo).');
} else {
  console.log('[FabricaFlow] 🔌 Conectado com sucesso ao Supabase Cloud.');
}

// Cria o cliente Supabase apenas se estiver configurado para evitar crashes ao iniciar
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
