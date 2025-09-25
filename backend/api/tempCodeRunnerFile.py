
import requests

# Your real key here WITHOUT spaces or splits!
GEMINI_API_KEY = "AIzaSyApuCK8alV6UoF1BxpigqPCJTNTslxCEc4"

endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

headers = {
    "Content-Type": "application/json"
}
payload = {
    "contents": [
        {
            "parts": [
                {"text": "Suggest 5 trending keywords for sports shoes."}
            ]
        }
    ]
}

response = requests.post(
    endpoint + f"?key={GEMINI_API_KEY}",
    headers=headers,
    json=payload,
)

if response.status_code == 200:
    print(response.json())
else:
    print("Error:", response.status_code, response.text)
