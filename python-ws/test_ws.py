import asyncio
import websockets
import json

async def test():
    async with websockets.connect("ws://localhost:8765") as ws:
        await ws.send(json.dumps({"type": "crisis_query", "text": "How should I teach science according to NCF guidelines?"}))
        print("Query sent, waiting for response...")
        while True:
            msg = json.loads(await ws.recv())
            if msg["type"] == "status":
                print(f"[STATUS] {msg['status']}")
            elif msg["type"] == "chunk":
                print(msg["text"], end="", flush=True)
            elif msg["type"] == "done":
                print()
                print("[DONE] Response complete")
                break
            elif msg["type"] == "error":
                print(f"[ERROR] {msg['message']}")
                break

asyncio.run(test())
