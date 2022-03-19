import { SUPABASE_URL, SUPABASE_API } from "@env";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabase = createClient(SUPABASE_URL, SUPABASE_API, {
  localStorage: AsyncStorage,
  detectSessionInUrl: false,
});

export { supabase };
