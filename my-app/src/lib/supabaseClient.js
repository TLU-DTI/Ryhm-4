import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xaibektxcmgksegbknnv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaWJla3R4Y21na3NlZ2Jrbm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwODkzNzIsImV4cCI6MjAzMzY2NTM3Mn0.RuNdCBW9piWs3-KOSAwVrtVu20CB75p2AgliNsXIBR8';
export const supabase = createClient(supabaseUrl, supabaseKey);