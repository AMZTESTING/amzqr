import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nwgzhqxhmobgjghkfxrm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z3pocXhobW9iZ2pnaGtmeHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTU1OTMsImV4cCI6MjA5NDQ3MTU5M30.Ja4qTLq9IAIMJJPRvpzAIxsOtWlK43E7xX0LQWnEUss' // تأكد إنه anon key كامل

export const supabase = createClient(supabaseUrl, supabaseKey)