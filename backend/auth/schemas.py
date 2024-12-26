# backend/auth/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str
    profile_image_url: Optional[str] = "/user.png"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    profile_image_url: Optional[str] = None
    role: Optional[str] = None

class UserRoleUpdateForm(BaseModel):
    role: str

class User(UserBase):
    id: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class TokenData(BaseModel):
    email: Optional[str] = None

class Login(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    id: str
    email: str
    name: str
    role: str
    profile_image_url: str

    class Config:
        from_attributes = True