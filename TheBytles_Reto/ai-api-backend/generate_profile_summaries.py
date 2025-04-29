import os
import requests
import io
import fitz  # PyMuPDF
from bart_hf import generate_roles
from supabase import create_client
from dotenv import load_dotenv
from transformers import AutoTokenizer
from datetime import datetime

load_dotenv()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
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

def generate_single_user_summary(user_id):
    try:
        user = supabase.table("User").select("*").eq("id", user_id).single().execute().data
        if not user:
            print("User not found")
            return False

        print(f"Generating summary for {user['id']} - {user.get('name', '')}")
        pdf_text = download_and_extract_text(user["cv_url"])

        combined_info = f"""
        BIO: {user.get('bio', '')}
        CAPABILITY: {user.get('capability', '')}
        CV TEXT: {pdf_text}
        """

        prompt = f"""
        You are an AI assistant summarizing a candidate's profile. Based on the information below, write a concise paragraph that captures the candidate's key skills, experience, and strengths:\n\n{trim_to_token_limit(combined_info)}
        """

        summary_lines = generate_roles(prompt)
        full_summary = " ".join(summary_lines)

        supabase.table("User").update({
            "ai_summary": full_summary,
            "summary_generated_at": datetime.utcnow().isoformat()
        }).eq("id", user_id).execute()

        print(f"✅ Summary saved for user {user_id}")
        return True

    except Exception as e:
        print(f"❌ Error generating summary for user {user_id}: {e}")
        return False