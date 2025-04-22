import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-2-13b-chat-hf"
HEADERS = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}"}

def generate_roles(prompt: str) -> list:
    response = requests.post(API_URL, headers=HEADERS, json={"inputs": prompt})

    if response.status_code != 200:
        raise Exception(f"Hugging Face API Error: {response.text}")

    data = response.json()
    raw_output = data[0]['generated_text'] if isinstance(data, list) else data.get('generated_text', '')

    # Clean & return as list of roles
    roles = [line.strip() for line in raw_output.split('\n') if line.strip()]
    return roles