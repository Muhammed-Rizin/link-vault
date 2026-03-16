import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = "https://bbzjavdozszvawqbklhe.supabase.co";
// I'll leave the key placeholder for you to run locally if needed,
// but I've updated the script to use the publishable key as a fallback.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_publishable_QCpLkqpAl9ErLZdPh8c2Rg_1sPI8ds6"; 

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migratePositions() {
  console.log("🚀 Starting Link Position Migration...");

  // 1. Fetch all links sorted by created_at (Earliest First)
  const { data: links, error: fetchError } = await supabase
    .from("vault_links")
    .select("id, created_at, title")
    .order("created_at", { ascending: true });

  if (fetchError) {
    console.error("❌ Error fetching links:", fetchError.message);
    if (fetchError.message.includes("JWT")) {
       console.log("💡 Tip: Migration script needs a SERVICE_ROLE_KEY to bypass RLS for bulk updates.");
    }
    return;
  }

  if (!links || links.length === 0) {
    console.log("ℹ️ No links found to migrate.");
    return;
  }

  console.log(`📦 Found ${links.length} links. Re-indexing...`);

  // 2. Assign positions based on order (gap of 1024)
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const newPosition = i * 1024;

    const { error: updateError } = await supabase
      .from("vault_links")
      .update({ position: newPosition })
      .eq("id", link.id);

    if (updateError) {
      console.error(`❌ Failed to update link ${link.id} (${link.title}):`, updateError.message);
    } else {
      console.log(`✅ [${i + 1}/${links.length}] ${link.title} -> ${newPosition}`);
    }
  }

  console.log("🏁 Migration Complete! All links rearranged by creation date.");
}

migratePositions();
