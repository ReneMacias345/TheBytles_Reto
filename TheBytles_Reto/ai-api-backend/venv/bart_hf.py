import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
HEADERS = {
    "Authorization": f"Bearer " + os.getenv("HUGGINGFACE_API_KEY"),
    "Content-Type": "application/json"
}

def generate_roles(prompt: str) -> list:
    try:
        response = requests.post(API_URL, headers=HEADERS, json={"inputs": prompt})

        if response.status_code != 200:
            raise Exception(f"Hugging Face API Error: {response.status_code} - {response.text}")

        data = response.json()
        raw_output = data[0]['summary_text'] if isinstance(data, list) else data.get('summary_text', '')
        roles = [r.strip() for r in raw_output.split('\n') if r.strip()]
        if len(roles) == 1:
            roles = [p.strip() for p in raw_output.split('. ') if p.strip()]
        return roles

    except Exception as e:
        print(f"Hugging Face request failed: {e}")
        return ["[Error generating summary]"]