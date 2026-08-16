import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// 1. Імпортуємо встановлений пакет вебсокетів
import ws from 'ws';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Помилка: Відсутні SUPABASE_URL або SUPABASE_SERVICE_ROLE_KEY у файлі .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false 
  },
  realtime: {
    transport: ws
  }
});
