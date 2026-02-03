import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gzdiqqqvqocurvtivuyx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6ZGlxcXF2cW9jdXJ2dGl2dXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDQ4NDAsImV4cCI6MjA3NDg4MDg0MH0.IKkAzNlncfP_gL-QBtdjSnrnHzWUPH-NvZKQWtFpNS0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
