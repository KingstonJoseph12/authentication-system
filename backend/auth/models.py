# backend/auth/models.py
from sqlalchemy import Boolean, Column, String, Text
from database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String, default="pending")  # pending, user, admin
    hashed_password = Column(Text)
    profile_image_url = Column(String, default="/user.png")
    is_active = Column(Boolean, default=True)