import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://eqejcatcudonbxsezqcw.supabase.co'
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_yF2UWZrxIschNTqTTm_H6g_CjEtkvCL'

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
