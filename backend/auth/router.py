# backend/auth/router.py
from datetime import timedelta
from typing import List
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from config import settings
from . import models, schemas, utils

router = APIRouter()
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

@router.post("/auth/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if this is the first user
    user_count = db.query(models.User).count()
    logger.debug(f"Current user count: {user_count}")
    
    role = "admin" if user_count == 0 else "pending"
    logger.debug(f"Assigning role: {role}")
    
    hashed_password = utils.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password,
        profile_image_url=user.profile_image_url,
        role=role
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
        logger.debug(f"User created with role: {db_user.role}")
        return db_user
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auth/login", response_model=schemas.Token)
def login(user_credentials: schemas.Login, db: Session = Depends(get_db)):
    logger.debug(f"Login attempt for email: {user_credentials.email}")
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    
    if not user:
        logger.debug("User not found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    logger.debug(f"Found user with role: {user.role}")
    
    if not utils.verify_password(user_credentials.password, user.hashed_password):
        logger.debug("Invalid password")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    logger.debug(f"User role before pending check: {user.role}")
    if user.role == "pending":
        logger.debug("User account is pending")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account pending approval"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = utils.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    logger.debug("Login successful, returning token")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "profile_image_url": user.profile_image_url
    }

@router.get("/auth/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(utils.get_current_active_user)):
    logger.debug(f"Returning current user info. Role: {current_user.role}")
    return current_user

@router.get("/users", response_model=List[schemas.User])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(utils.get_admin_user),
    db: Session = Depends(get_db)
):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.put("/users/{user_id}/role", response_model=schemas.User)
async def update_user_role(
    user_id: str,
    role_update: schemas.UserRoleUpdateForm,
    current_user: models.User = Depends(utils.get_admin_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.role = role_update.role
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: models.User = Depends(utils.get_admin_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if db_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    db.delete(db_user)
    db.commit()
    return {"ok": True}