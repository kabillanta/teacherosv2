import { useState, useRef, useCallback, useEffect } from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, MicOff, Volume2 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

type ConnectionState = "idle" | "connecting" | "ready" | "listening" | "thinking" | "speaking" | "error";

export default function Speak() {
  const { user } = useAuth();
  const [state, setState] = useState<ConnectionState>("idle");
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const playbackContextRef = useRef<AudioContext | null>(null);

  const playAudioQueue = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return;
    isPlayingRef.current = true;
    setState("speaking");

    if (!playbackContextRef.current) {
      playbackContextRef.current = new AudioContext({ sampleRate: 24000 });
    }
    const ctx = playbackContextRef.current;

    while (audioQueueRef.current.length > 0) {
      const pcmData = audioQueueRef.current.shift()!;
      const int16 = new Int16Array(pcmData);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
      }

      const buffer = ctx.createBuffer(1, float32.length, 24000);
      buffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      await new Promise<void>((resolve) => {
        source.onended = () => resolve();
        source.start();
      });
    }

    isPlayingRef.current = false;
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      setState("ready");
    }
  }, []);

  const connectSession = useCallback(async () => {
    if (!user) return;
    setState("connecting");
    setTranscript("");
    setErrorMsg("");

    try {
      const userId = (user as any).claims?.sub || (user as any).id;
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const ws = new WebSocket(`${protocol}//${window.location.host}/ws/speak?userId=${userId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setState("connecting");
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === "ready") {
            setState("ready");
          } else if (msg.type === "audio" && msg.data) {
            const binaryStr = atob(msg.data);
            const bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) {
              bytes[i] = binaryStr.charCodeAt(i);
            }
            audioQueueRef.current.push(bytes.buffer);
            playAudioQueue();
          } else if (msg.type === "text") {
            setTranscript((prev) => prev + msg.data);
          } else if (msg.type === "turnComplete") {
            if (!isPlayingRef.current) {
              setState("ready");
            }
          } else if (msg.type === "error") {
            setErrorMsg(msg.message);
            setState("error");
          } else if (msg.type === "sessionClosed") {
            setState("idle");
          }
        } catch (e) {
          console.error("Error parsing WS message:", e);
        }
      };

      ws.onerror = () => {
        setErrorMsg("Connection failed. Please try again.");
        setState("error");
      };

      ws.onclose = () => {
        if (state !== "error") {
          setState("idle");
        }
      };
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to connect");
      setState("error");
    }
  }, [user, playAudioQueue]);

  const startListening = useCallback(async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) return;

        const float32 = e.inputBuffer.getChannelData(0);
        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
          const s = Math.max(-1, Math.min(1, float32[i]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        const uint8 = new Uint8Array(int16.buffer);
        let binaryStr = "";
        for (let i = 0; i < uint8.length; i++) {
          binaryStr += String.fromCharCode(uint8[i]);
        }
        const base64 = btoa(binaryStr);

        wsRef.current.send(JSON.stringify({
          type: "audio",
          data: base64,
        }));
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      setState("listening");
    } catch (error: any) {
      setErrorMsg("Microphone access denied. Please allow mic access.");
      setState("error");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      setState("ready");
    }
  }, []);

  const disconnect = useCallback(() => {
    stopListening();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (playbackContextRef.current) {
      playbackContextRef.current.close();
      playbackContextRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setState("idle");
    setTranscript("");
  }, [stopListening]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const handleMicToggle = () => {
    if (state === "idle" || state === "error") {
      connectSession();
    } else if (state === "ready" || state === "speaking") {
      startListening();
    } else if (state === "listening") {
      stopListening();
    }
  };

  const stateConfig: Record<ConnectionState, { color: string; label: string; sublabel: string }> = {
    idle: { color: "bg-stone-900", label: "Tap to Start", sublabel: "Connect to your AI assistant" },
    connecting: { color: "bg-amber-500", label: "Connecting...", sublabel: "Setting up your session" },
    ready: { color: "bg-emerald-600", label: "Tap to Speak", sublabel: "I'm listening whenever you're ready" },
    listening: { color: "bg-red-500", label: "Listening...", sublabel: "Speak naturally — tap to stop" },
    thinking: { color: "bg-blue-500", label: "Thinking...", sublabel: "Processing your question" },
    speaking: { color: "bg-purple-600", label: "Speaking...", sublabel: "AI is responding" },
    error: { color: "bg-red-700", label: "Tap to Retry", sublabel: errorMsg || "Something went wrong" },
  };

  const currentConfig = stateConfig[state];

  return (
    <Layout>
      <div className="p-5 pt-8 md:p-6 md:pt-12 min-h-screen pb-32 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <button className="p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors text-stone-500" data-testid="button-back">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <div className="text-center">
            <h1 className="font-serif text-xl text-stone-900">Speak</h1>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">AI Assistant</p>
          </div>
          {state !== "idle" && (
            <button
              onClick={disconnect}
              className="text-xs font-bold text-stone-500 hover:text-red-600 transition-colors uppercase tracking-wider"
              data-testid="button-disconnect"
            >
              End
            </button>
          )}
          {state === "idle" && <div className="w-10" />}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center space-y-2"
            >
              <h2 className="font-serif text-2xl text-stone-900" data-testid="text-speak-status">
                {currentConfig.label}
              </h2>
              <p className="text-stone-500 text-sm max-w-xs">
                {currentConfig.sublabel}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="relative">
            {(state === "listening" || state === "speaking") && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute inset-0 rounded-full ${currentConfig.color} opacity-20`}
                  style={{ margin: "-20px" }}
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.05, 0.2] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  className={`absolute inset-0 rounded-full ${currentConfig.color} opacity-10`}
                  style={{ margin: "-40px" }}
                />
              </>
            )}

            <motion.button
              onClick={handleMicToggle}
              disabled={state === "connecting" || state === "thinking"}
              whileTap={{ scale: 0.95 }}
              className={`relative z-10 w-28 h-28 rounded-full ${currentConfig.color} flex items-center justify-center shadow-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
              data-testid="button-mic"
            >
              {state === "speaking" ? (
                <Volume2 className="w-10 h-10 text-white" />
              ) : state === "listening" ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : state === "connecting" ? (
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </motion.button>
          </div>

          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm bg-white p-5 rounded-2xl border border-stone-200 shadow-sm"
            >
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Response</p>
              <p className="text-stone-700 leading-relaxed font-serif" data-testid="text-transcript">
                {transcript}
              </p>
            </motion.div>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-[10px] text-stone-300 uppercase tracking-widest">
            Powered by Gemini AI
          </p>
        </div>
      </div>
    </Layout>
  );
}
