import os
import requests
from dotenv import load_dotenv

load_dotenv()

# Hugging Face model endpoint
API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
HEADERS = {
    "Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}",
    "Content-Type": "application/json"
}

def generate_roles_from_rfp(rfp_text: str) -> list:
    prompt = f"""
    Based on the following request for proposals (RFP), extract the profiles of the different roles the project may require.

    For each role, write one paragraph describing the key skills, primary responsibilities, and preferred experience, 
    without naming the role itself. Do not use job titles (e.g., "developer", "project manager"), 
    just describe what is expected of the person in that position.

    RFP Content:
    {rfp_text}
    """

    try:
        response = requests.post(API_URL, headers=HEADERS, json={"inputs": prompt})

        if response.status_code != 200:
            raise Exception(f"Hugging Face API Error: {response.status_code} - {response.text}")

        data = response.json()
        output = data[0]['summary_text'] if isinstance(data, list) else data.get('summary_text', '')

        # Split by paragraph — assumes output uses double newlines or periods to separate roles
        roles = [r.strip() for r in output.split('\n') if r.strip()]
        if len(roles) == 1:  # fallback if no \n used
            roles = [p.strip() for p in output.split('. ') if p.strip()]
        return roles

    except Exception as e:
        print(f"Failed to generate roles from RFP: {e}")
        return ["[Error generating role descriptions]"]