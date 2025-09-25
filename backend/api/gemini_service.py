import requests
import json
from django.conf import settings

def generate_text_from_gemini(prompt):
    """
    Sends a prompt to the Gemini API and returns the generated text.
    """
    # It is recommended to store the API key in your Django settings
    api_key = getattr(settings, "GEMINI_API_KEY", "AIzaSyApuCK8alV6UoF1BxpigqPCJTNTslxCEc4") # Fallback for now
    if not api_key:
        return "Error: GEMINI_API_KEY not found in settings."

    endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    try:
        response = requests.post(
            f"{endpoint}?key={api_key}",
            headers=headers,
            json=payload,
            timeout=60 
        )
        response.raise_for_status()  # Raise an exception for bad status codes
        
        response_json = response.json()
        
        # Safely access the generated text
        candidates = response_json.get('candidates', [])
        if not candidates:
            return "Error: No candidates returned from Gemini."
            
        content = candidates[0].get('content', {})
        parts = content.get('parts', [])
        if not parts:
            return "Error: No parts found in Gemini response."
            
        return parts[0].get('text', "Error: Could not extract text from Gemini response.")

    except requests.exceptions.RequestException as e:
        return f"Error calling Gemini API: {e}"
    except (KeyError, IndexError) as e:
        return f"Error parsing Gemini response: {e}"