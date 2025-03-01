from fastapi import FastAPI
from routes.auth import router as auth_router
from routes.admin import router as admin_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Mentorship Project"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_router, prefix="/admin", tags=['Admin'])
app.include_router(auth_router, prefix="/auth", tags=['Authentication'])

@app.get('/')
def description():
    return {"Title": "Mentorship Project"}
