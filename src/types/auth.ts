// src/types/auth.ts

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    profile_image_url: string;
    last_active_at: number;
    updated_at: number;
    created_at: number;
    api_key?: string;
    settings?: UserSettings;
    info?: Record<string, any>;
    oauth_sub?: string;
  }
  
  export interface UserSettings {
    ui?: Record<string, any>;
    [key: string]: any;
  }
  
  export interface Token {
    token: string;
    token_type: string;
  }
  
  export interface SigninForm {
    email: string;
    password: string;
  }
  
  export interface SignupForm {
    name: string;
    email: string;
    password: string;
    profile_image_url?: string;
  }
  
  export interface UpdateProfileForm {
    profile_image_url: string;
    name: string;
  }
  
  export interface UpdatePasswordForm {
    password: string;
    new_password: string;
  }
  
  export interface AddUserForm extends SignupForm {
    role?: string;
  }
  
  export interface UserRoleUpdateForm {
    id: string;
    role: string;
  }
  
  export interface ApiKeyResponse {
    api_key: string | null;
  }
  
  export interface SigninResponse extends Token {
    id: string;
    email: string;
    name: string;
    role: string;
    profile_image_url: string;
  }