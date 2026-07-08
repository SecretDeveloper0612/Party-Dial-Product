/**
 * Utility to emit realtime events to the Durable Object from other Cloudflare Worker routes.
 */
export async function emitRealtimeEvent(env, room, event, payload) {
  try {
    if (!env.REALTIME_DO) {
      console.warn("REALTIME_DO binding is not configured. Skipping emit.");
      return;
    }

    const id = env.REALTIME_DO.idFromName("global");
    const obj = env.REALTIME_DO.get(id);

    // Send a POST request to the DO's fetch handler to broadcast the event
    const response = await obj.fetch(new Request("http://internal/emit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room, event, payload })
    }));

    if (!response.ok) {
      console.error(`Failed to emit realtime event ${event} to room ${room}. Status: ${response.status}`);
    }
  } catch (err) {
    console.error("Error emitting realtime event:", err);
  }
}
