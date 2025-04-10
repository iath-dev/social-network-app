export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirm: string;
}

export interface LoginResponse {
    token: string;
}

export interface UserProfile {
    id: number;
    name: string;
    email: string;
}