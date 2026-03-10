from fastapi import APIRouter
from datetime import datetime
 
router = APIRouter(prefix='/health', tags=['Health'])
 
@router.get('/')
async def health_check():
    return {
        "status": "ok",
        "service": "PolicyWise AI API",
        "timestamp": datetime.utcnow().isoformat()
    }
