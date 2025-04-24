import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def insert_roles_to_supabase(roles: list):
    data = [{"role_description": role} for role in roles]

    try:
        response = supabase.table("Role").insert(data).execute()
        return response
    except Exception as e:
        return {"error": str(e)}