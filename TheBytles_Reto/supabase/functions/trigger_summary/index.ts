import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  const payload = await req.json();
  const newUser = payload.record;
  const oldUser = payload.old_record;

  const cvChanged = newUser?.cv_url !== oldUser?.cv_url;
  const bioChanged = newUser?.bio !== oldUser?.bio;
  const capabilityChanged = newUser?.capability !== oldUser?.capability;

  if (cvChanged || bioChanged || capabilityChanged) {
    const response = await fetch("https://the-bytles-reto.vercel.app/generate-summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_id: newUser.userId })
    });

    const result = await response.json();
    return new Response(JSON.stringify({ status: result.status }), { status: 200 });
  }

  return new Response("No relevant changes — skipping", { status: 200 });
});