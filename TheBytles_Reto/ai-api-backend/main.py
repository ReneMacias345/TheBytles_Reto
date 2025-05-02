from fastapi import FastAPI
from pydantic import BaseModel
from generate_profile_summaries import generate_user_summary
from generate_roles_from_rfp import generate_roles_from_rfp

app = FastAPI()

class SummaryRequest(BaseModel):
    user_id: str

@app.post("/generate-summary")
async def generate_summary(payload: SummaryRequest):
    user_id = payload.user_id
    success = generate_user_summary(user_id)
    return {"status": "success" if success else "error"}
 
class RoleGenRequest(BaseModel):
    project_id: str

@app.post("/generate-roles")
async def generate_roles(request: RoleGenRequest):
    success = generate_roles_from_rfp(request.project_id)
    return { "status": "success" if success else "error"}