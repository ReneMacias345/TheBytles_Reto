import os
import requests
import io
import fitz  # PyMuPDF
from dotenv import load_dotenv
from datetime import datetime
from supabase import create_client
from transformers import AutoTokenizer
from cohere_roles import extract_roles
from cohere_embed import generate_embedding

load_dotenv()

# Supabase setup
supabase = create_client(os.getenv("VITE_SUPABASE_URL"), os.getenv("VITE_SUPABASE_ANON_KEY"))

# Tokenizer for trimming
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")

def trim_to_token_limit(text, max_tokens=1024):
    tokens = tokenizer.encode(text, truncation=True, max_length=max_tokens)
    return tokenizer.decode(tokens)

def download_and_extract_text(cv_url):
    response = requests.get(cv_url)
    response.raise_for_status()
    with io.BytesIO(response.content) as pdf_file:
        doc = fitz.open(stream=pdf_file, filetype="pdf")
        text = "\n".join([page.get_text() for page in doc])
    return text

def generate_roles_from_rfp(project_id):
    try:
        # Fetch RFP URL from Supabase Project table
        project = supabase.table("Project").select("rfp_url").eq("Project_ID", project_id).single().execute().data
        if not project or not project.get("rfp_url"):
            print("No RFP URL found for this project.")
            return False

        rfp_url = project["rfp_url"]
        print(f"Downloading RFP from: {rfp_url}")
        rfp_text = download_and_extract_text(rfp_url)

        print("Generating roles from RFP...")
        roles = extract_roles(rfp_text)

        for role_text in roles:
            embedding = generate_embedding(role_text)
            print(f"Generated Role:\n{role_text}\n")

            supabase.table("Role").insert({
                "role_description": role_text,
                "project_id": project_id,
                "embedding_vector": embedding
            }).execute()

        print(f"{len(roles)} roles saved to Supabase.")
        return True

    except Exception as e:
        print(f"Error generating roles: {e}")
        return False