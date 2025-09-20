// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vtpipgoewojgqqhepifc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0cGlwZ29ld29qZ3FxaGVwaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTQ3OTcsImV4cCI6MjA3Mzg3MDc5N30.37AsmA0y7KXTJFQus-FXadTsBfI_cpfq-GHJvlPq97U';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;