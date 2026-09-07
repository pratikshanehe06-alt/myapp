from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, password_reset
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import UserResponse

app = FastAPI(title="CoreOT API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(password_reset.router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user
