import requests
import json

s = requests.Session()

# Step 1: Login
login = s.get("http://localhost:5000/api/login", allow_redirects=False)
print(f"Login: {login.status_code}")

# Step 2: Call /api/prep
resp = s.post("http://localhost:5000/api/prep", json={
    "subject": "Biology",
    "topic": "Cell Structure",
    "class": "8"
}, timeout=120)

print(f"Prep Status: {resp.status_code}")
content_type = resp.headers.get("content-type", "")
print(f"Content-Type: {content_type}")

if "json" in content_type:
    data = resp.json()
    print("\n=== RAW RESPONSE ===")
    print(json.dumps(data, indent=2)[:3000])
    
    # Try to parse the agent response
    raw = data.get("response", data)
    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except:
            pass
    
    if isinstance(raw, dict):
        print("\n=== PARSED FIELDS ===")
        print(f"Answer: {str(raw.get('answer', 'N/A'))[:300]}")
        print(f"Key Points: {raw.get('key_points', [])}")
        print(f"Sources: {raw.get('sources', [])}")
        print(f"Follow-ups: {raw.get('suggested_followups', [])}")
    
    print("\n✅ SUCCESS - Prep endpoint working!")
else:
    print(f"\n❌ Got HTML instead of JSON (first 200 chars):")
    print(resp.text[:200])
