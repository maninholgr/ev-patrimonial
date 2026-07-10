import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const { data, error } = await supabase
  .from("evpatrimonial_admin")
  .select("*");

console.log("ERRO:");
console.log(error);

console.log("");

console.log("DADOS:");
console.log(data);