from fastapi import FastAPI, Request
from bart_hf import generate_roles
from supabase_utils import insert_roles_to_supabase

app = FastAPI()

@app.get("/")
def root():
    return {"status": "Bart API running!"}

@app.post("/process-rfp")
async def process_rfp(payload: dict):
    rfp_text = payload.get("rfp_text")

    if not rfp_text:
        return {"error": "Missing RFP text."}

    try:
        roles = generate_roles(rfp_text)
        db_response = insert_roles_to_supabase(roles)
        return {
            "status": "success",
            "roles_uploaded": len(roles),
            "supabase_result": db_response
        }
    except Exception as e:
        return {"error": str(e)}
