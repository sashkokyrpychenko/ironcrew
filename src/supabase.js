import {createClient} from '@supabase/supabase-js';
const url = 'https://ipeflzuidnbckisddwdz.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwZWZsenVpZG5iY2tpc2Rkd2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTk3MjIsImV4cCI6MjA5NDA5NTcyMn0.jsvfZR9IlqagfJN7lqIfad7iF9lgyrY-2_xhFKUXRcE';
export const supabase = createClient(url, key);