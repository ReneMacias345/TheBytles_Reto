from fastapi import FastAPI, Request
from generate_profile_summaries import generate_single_user_summary

app = FastAPI()

@app.get("/")
def root():
    return {"status": "Bart API running"}

@app.post("/generate-summary")
async def generate_summary(request: Request):
    data = await request.json()
    user_id = data.get("user_id")
    
    if not user_id:
        return {"error": "Missing user_id"}

    success = generate_single_user_summary(user_id)
    return {"status": "success" if success else "error"}