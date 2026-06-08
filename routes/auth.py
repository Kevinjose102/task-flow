from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from auth_utils import hash_password, verify_password
from auth_utils import create_access_token
from database import get_db
from models import UserTable
from schemas import User
from fastapi import HTTPException, Request
from core.limiter import limiter

router = APIRouter()

@router.post("/signup")
@limiter.limit("5/minute")
def signup(
    request: Request,
    user: User, 
    db: Session = Depends(get_db)):
    new_user = UserTable(
        username=user.username,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post("/login")
@limiter.limit("5/minute")
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(UserTable).filter(
        UserTable.username == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        data={"sub": db_user.username}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }