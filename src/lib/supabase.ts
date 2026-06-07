import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://nkilaopfbqlwqpnmsiqd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5raWxhb3BmYnFsd3Fwbm1zaXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4Mjc3NjAsImV4cCI6MjA5NjQwMzc2MH0.SeDu8VVYa1Iq-ATiqH_1-CqdGS_m-BRi7KpOhp6XYnI'
);