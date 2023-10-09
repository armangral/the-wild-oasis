import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://fsvqywsiwnxxngzsiocb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdnF5d3Npd254eG5nenNpb2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQzNjM2MzgsImV4cCI6MjAwOTkzOTYzOH0.iTY6D7ZRyzpwpmKeEUKyAsyzzvW3UzeFHYiTGI7zMDA";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
