import { GoogleGenAI, Modality } from "@google/genai";
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { storage } from "./storage";
import { log } from "./index";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

const LIVE_MODEL = "gemini-2.5-flash-preview-native-audio-dialog";

async function buildSystemInstruction(userId: string): Promise<string> {
  const profile = await storage.getProfile(userId);
  const timetable = await storage.getTimetable(userId);
  const reflections = await storage.getReflections(userId);

  let context = `You are TeacherOS AI — a calm, wise, and supportive teaching assistant for Indian school teachers. You speak naturally and concisely. Keep responses under 3 sentences unless asked for more detail.

Your role:
- Help with classroom management, lesson planning, and teaching strategies
- Give practical, actionable advice suited to Indian classrooms (CBSE, ICSE, State Boards)
- Be empathetic — teachers are often stressed and overworked
- Use simple language, avoid jargon unless the teacher uses it first
`;

  if (profile) {
    context += `\n## Teacher Context
- Name: ${profile.name}
- School Board: ${profile.schoolType}
- Subjects: ${profile.subjects?.join(", ") || "Not specified"}
- Classes: ${profile.classes?.join(", ") || "Not specified"}
- Available Resources: ${profile.resources?.join(", ") || "Not specified"}
`;
  }

  if (timetable && timetable.length > 0) {
    context += `\n## Today's Schedule\n`;
    timetable.forEach((s) => {
      context += `- ${s.time}: ${s.subject} (Class ${s.className}${s.section ? `-${s.section}` : ""})${s.topic ? ` — Topic: ${s.topic}` : ""}\n`;
    });
  }

  if (reflections && reflections.length > 0) {
    const recent = reflections.slice(-5);
    context += `\n## Recent Reflections\n`;
    recent.forEach((r) => {
      const energyLabel = r.energy === 0 ? "Low" : r.energy === 1 ? "Okay" : "High";
      context += `- Energy: ${energyLabel}${r.strategy ? `, Strategy: ${r.strategy}` : ""}${r.notes ? `, Notes: ${r.notes}` : ""}\n`;
    });
  }

  return context;
}

export function setupGeminiLive(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws/speak" });

  wss.on("connection", async (ws: WebSocket, req) => {
    log("New speak WebSocket connection", "gemini");

    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      ws.send(JSON.stringify({ type: "error", message: "Missing userId" }));
      ws.close();
      return;
    }

    let geminiSession: any = null;
    let isSessionActive = false;

    try {
      const systemInstruction = await buildSystemInstruction(userId);
      log(`RAG context built for user ${userId}`, "gemini");

      geminiSession = await ai.live.connect({
        model: LIVE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: systemInstruction,
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Kore",
              },
            },
          },
        },
        callbacks: {
          onopen: () => {
            log("Gemini Live session opened", "gemini");
            isSessionActive = true;
            ws.send(JSON.stringify({ type: "ready" }));
          },
          onmessage: (msg: any) => {
            try {
              if (msg.serverContent?.modelTurn?.parts) {
                for (const part of msg.serverContent.modelTurn.parts) {
                  if (part.inlineData) {
                    ws.send(JSON.stringify({
                      type: "audio",
                      data: part.inlineData.data,
                      mimeType: part.inlineData.mimeType,
                    }));
                  }
                  if (part.text) {
                    ws.send(JSON.stringify({
                      type: "text",
                      data: part.text,
                    }));
                  }
                }
              }
              if (msg.serverContent?.turnComplete) {
                ws.send(JSON.stringify({ type: "turnComplete" }));
              }
              if (msg.serverContent?.interrupted) {
                ws.send(JSON.stringify({ type: "interrupted" }));
              }
            } catch (e) {
              log(`Error processing Gemini message: ${e}`, "gemini");
            }
          },
          onerror: (e: any) => {
            log(`Gemini Live error: ${e?.message || e}`, "gemini");
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "error", message: "AI connection error" }));
            }
          },
          onclose: () => {
            log("Gemini Live session closed", "gemini");
            isSessionActive = false;
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "sessionClosed" }));
            }
          },
        },
      });
    } catch (error: any) {
      log(`Failed to connect to Gemini Live: ${error?.message || error}`, "gemini");
      ws.send(JSON.stringify({ type: "error", message: "Failed to start AI session" }));
      ws.close();
      return;
    }

    ws.on("message", async (data) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "audio" && geminiSession && isSessionActive) {
          geminiSession.sendRealtimeInput({
            audio: {
              data: msg.data,
              mimeType: "audio/pcm;rate=16000",
            },
          });
        }

        if (msg.type === "text" && geminiSession && isSessionActive) {
          geminiSession.sendClientContent({
            turns: [{ role: "user", parts: [{ text: msg.data }] }],
            turnComplete: true,
          });
        }
      } catch (e) {
        log(`Error handling client message: ${e}`, "gemini");
      }
    });

    ws.on("close", () => {
      log("Client WebSocket closed", "gemini");
      if (geminiSession) {
        try {
          geminiSession.close();
        } catch (e) {}
      }
      isSessionActive = false;
    });

    ws.on("error", (err) => {
      log(`WebSocket error: ${err.message}`, "gemini");
    });
  });

  log("Gemini Live WebSocket server ready at /ws/speak", "gemini");
}
