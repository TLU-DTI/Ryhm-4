import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pqjseszhxbtxgwympkcw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxanNlc3poeGJ0eGd3eW1wa2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTc3MjQsImV4cCI6MjA3MDczMzcyNH0.uBOL1b6yQX2hg3dnUfOmWLqR067HK4AD7nw0QIFpTvk';
export const supabase = createClient(supabaseUrl, supabaseKey);
