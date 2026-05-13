from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from auth_utils import hash_password, verify_password
from auth_utils import create_access_token
from database import get_db
from models import UserTable
from schemas import User

router = APIRouter()

@router.post("/signup")
def signup(user: User, db: Session = Depends(get_db)):
    new_user = UserTable(
        username=user.username,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(UserTable).filter(
        UserTable.username == form_data.username
    ).first()

    if not db_user:
        return {"message": "User not found"}

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        return {"message": "Invalid password"}

    access_token = create_access_token(
        data={"sub": db_user.username}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }