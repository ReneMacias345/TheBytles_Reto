import os
import cohere
from dotenv import load_dotenv

load_dotenv()

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.Client(COHERE_API_KEY)

def extract_roles(rfp_text: str) -> list:
    try:
        prompt = f"""
You are an AI assistant analyzing an RFP (Request for Proposal). Your task is to extract multiple distinct paragraphs, each describing one role *required* by the project — but **without ever naming roles or using any labels, headers, or introductions**.

Each paragraph must:
- Be written in plain text.
- Focus only on required **skills**, **responsibilities**, and **preferred experience**.
- Not include any role names like “frontend developer”, “UI/UX designer”, “DevSecOps”, “project manager”, etc.
- Not include section labels or transitions like “Frontend Development:”, “We seek...”, “Finally...”, “The project calls for...”, etc.
- Be a **standalone summary** ready to be embedded for comparison with candidate profiles.

Your output must be only plain paragraphs. Do not include bullet points, headings, summaries or introductions to the content such as "Here are the distinct paragraphs describing the roles required for the project, extracted from the provided RFP:".

RFP TEXT:
{rfp_text}
"""

        response = co.generate(
            model="command-r-plus",
            prompt=prompt,
            max_tokens=800,
            temperature=0.3
        )

        result = response.generations[0].text.strip()
        roles = [p.strip() for p in result.split('\n') if p.strip()]
        return roles

    except Exception as e:
        print(f"Cohere role generation error: {e}")
        return ["[Error extracting roles from RFP]"]