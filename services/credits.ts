import { supabase } from "./supabaseClient";
import { getCurrentUser, setCurrentUser, patchCurrentUser  } from "./authService";

export async function consumeCredits(amount = 1) {
  const { data, error } = await supabase.rpc("consume_credits", { p_amount: amount });

  if (error) {
    const msg = (error as any)?.message || "";
    if (msg.includes("INSUFFICIENT_CREDITS")) {
      return { ok: false as const, reason: "no_credits" as const };
    }
    return { ok: false as const, reason: "error" as const, error };
  }

  const creditsLeft = data?.[0]?.credits_left ?? 0;

  patchCurrentUser({ credits: creditsLeft });

  window.dispatchEvent(
  new CustomEvent("studioplayai:user-updated", { detail: { credits: creditsLeft } })
);



  return { ok: true as const, creditsLeft };
}
