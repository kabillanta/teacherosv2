import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

const CRISIS_SYSTEM_PROMPT = `You are an expert classroom crisis support AI for Indian school teachers. You provide IMMEDIATE, actionable advice when a teacher is facing a difficult classroom situation.

Your responses must be:
1. CONCISE - Teachers are stressed and need help NOW. Lead with the single most important action.
2. PRACTICAL - Only suggest things a teacher can do immediately in a classroom setting.
3. EVIDENCE-BASED - Use proven classroom management strategies (proximity, redirection, de-escalation).
4. CULTURALLY AWARE - You understand Indian classroom contexts (large class sizes, mixed abilities, board exam pressure).

Format your response as:
**IMMEDIATE ACTION:** (1-2 sentences - what to do RIGHT NOW)

**WHY THIS WORKS:** (1-2 sentences explaining the psychology)

**NEXT STEPS:**
- Step 1 (what to do in 2 minutes)
- Step 2 (what to do after class)

Keep the total response under 150 words. No fluff. No disclaimers. Teachers need calm, clear direction.`;

export function setupCrisisWebSocket(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws/crisis" });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Crisis WebSocket connected");

    ws.on("message", async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === "crisis_query") {
          const userMessage = message.text;

          ws.send(JSON.stringify({ type: "status", status: "processing" }));

          const stream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: [
              { role: "user", parts: [{ text: userMessage }] },
            ],
            config: {
              maxOutputTokens: 8192,
              systemInstruction: CRISIS_SYSTEM_PROMPT,
            },
          });

          for await (const chunk of stream) {
            const text = chunk.text || "";
            if (text) {
              ws.send(JSON.stringify({ type: "chunk", text }));
            }
          }

          ws.send(JSON.stringify({ type: "done" }));
        }
      } catch (error) {
        console.error("Crisis WS error:", error);
        ws.send(JSON.stringify({
          type: "error",
          message: "Failed to get crisis support. Please try again.",
        }));
      }
    });

    ws.on("close", () => {
      console.log("Crisis WebSocket disconnected");
    });
  });

  return wss;
}
