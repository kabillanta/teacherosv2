import asyncio
import json
import os
import requests
import websockets
from dotenv import load_dotenv

load_dotenv()

LYZR_API_KEY = os.getenv("LYZR_API_KEY")
LYZR_AGENT_ID = os.getenv("LYZR_AGENT_ID")
LYZR_CHAT_URL = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/"

WS_HOST = "0.0.0.0"
WS_PORT = 8765


def query_lyzr_agent(user_message: str, session_id: str = "crisis-session") -> dict:
    """Send a message to the Lyzr NCF Advisor Agent and return the response."""
    payload = {
        "user_id": "teacher-user",
        "agent_id": LYZR_AGENT_ID,
        "session_id": session_id,
        "message": user_message,
    }
    headers = {
        "Content-Type": "application/json",
        "x-api-key": LYZR_API_KEY,
    }

    response = requests.post(LYZR_CHAT_URL, json=payload, headers=headers, timeout=60)
    response.raise_for_status()
    return response.json()


def format_response(lyzr_response: dict) -> str:
    """Format the Lyzr agent's structured JSON response into readable text for the crisis UI."""
    try:
        # The Lyzr response wraps the agent output; extract it
        raw = lyzr_response
        if isinstance(raw, dict) and "response" in raw:
            raw = raw["response"]

        # The agent returns a JSON string inside the response
        if isinstance(raw, str):
            try:
                raw = json.loads(raw)
            except json.JSONDecodeError:
                return raw

        # Build formatted text from the structured response
        parts = []

        answer = raw.get("answer", "")
        if answer:
            parts.append(f"**GUIDANCE:**\n{answer}")

        key_points = raw.get("key_points", [])
        if key_points:
            points_text = "\n".join(f"- {p}" for p in key_points)
            parts.append(f"\n**KEY POINTS:**\n{points_text}")

        sources = raw.get("sources", [])
        if sources:
            sources_text = "\n".join(f"- {s}" for s in sources)
            parts.append(f"\n**NCF SOURCES:**\n{sources_text}")

        followups = raw.get("suggested_followups", [])
        if followups:
            followups_text = "\n".join(f"- {f}" for f in followups)
            parts.append(f"\n**EXPLORE FURTHER:**\n{followups_text}")

        return "\n".join(parts) if parts else str(raw)

    except Exception:
        return str(lyzr_response)


async def handle_connection(websocket):
    """Handle a single WebSocket connection from the Crisis page."""
    print("Crisis WebSocket connected (Python)")

    try:
        async for raw_message in websocket:
            try:
                message = json.loads(raw_message)

                if message.get("type") == "crisis_query":
                    user_text = message.get("text", "")
                    print(f"Received crisis query: {user_text[:80]}...")

                    # Tell the client we're processing
                    await websocket.send(json.dumps({
                        "type": "status",
                        "status": "processing"
                    }))

                    # Query the Lyzr NCF RAG agent (blocking call run in executor)
                    loop = asyncio.get_event_loop()
                    lyzr_response = await loop.run_in_executor(
                        None, query_lyzr_agent, user_text
                    )

                    # Format the structured response into readable text
                    formatted = format_response(lyzr_response)

                    # Stream the response in chunks to match the existing UI behavior
                    chunk_size = 40
                    for i in range(0, len(formatted), chunk_size):
                        chunk = formatted[i:i + chunk_size]
                        await websocket.send(json.dumps({
                            "type": "chunk",
                            "text": chunk
                        }))
                        await asyncio.sleep(0.02)  # Small delay for streaming effect

                    # Signal completion
                    await websocket.send(json.dumps({"type": "done"}))
                    print("Response sent successfully")

            except json.JSONDecodeError:
                await websocket.send(json.dumps({
                    "type": "error",
                    "message": "Invalid message format."
                }))
            except requests.exceptions.RequestException as e:
                print(f"Lyzr API error: {e}")
                await websocket.send(json.dumps({
                    "type": "error",
                    "message": "Failed to reach NCF knowledge base. Please try again."
                }))
            except Exception as e:
                print(f"Error processing query: {e}")
                await websocket.send(json.dumps({
                    "type": "error",
                    "message": "Something went wrong. Please try again."
                }))

    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        print("Crisis WebSocket disconnected (Python)")


async def main():
    print(f"NCF Crisis WebSocket server starting on ws://{WS_HOST}:{WS_PORT}")
    print(f"Agent ID: {LYZR_AGENT_ID}")

    if not LYZR_API_KEY or not LYZR_AGENT_ID:
        print("ERROR: LYZR_API_KEY and LYZR_AGENT_ID must be set in .env")
        return

    async with websockets.serve(handle_connection, WS_HOST, WS_PORT):
        print(f"WebSocket server running on ws://localhost:{WS_PORT}")
        await asyncio.Future()  # Run forever


if __name__ == "__main__":
    main_task = main()
    asyncio.run(main_task)
