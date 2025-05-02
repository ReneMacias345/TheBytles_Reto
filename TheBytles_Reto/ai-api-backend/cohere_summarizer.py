import os
import cohere
from dotenv import load_dotenv

load_dotenv()

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.Client(COHERE_API_KEY)

def summarize_user(bio: str, capability: str, cv_text: str) -> str:
    try:
        prompt = f"""
You are an AI assistant summarizing a candidate’s professional profile for the purpose of semantic role matching. Based on the information provided, generate a concise, role-agnostic paragraph that highlights the candidate’s key technical and soft skills, relevant experience, and core competencies. Use specific, descriptive language to capture practical abilities and professional strengths (e.g., “Skilled in prototyping and usability testing” rather than “good with design”). The summary should be clear, professional, and suitable for comparing against a role description embedding.

BIO:
{bio}

CAPABILITY:
{capability}

CV TEXT:
{cv_text}
"""

        response = co.generate(
            model="command-r-plus",
            prompt=prompt,
            max_tokens=300,
            temperature=0.3
        )

        summary = response.generations[0].text.strip()
        return summary

    except Exception as e:
        print(f"Cohere summary generation error: {e}")
        return "[Error generating summary with Cohere]"