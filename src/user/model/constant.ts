export interface IUser {
  _id?: string;
  photo?: string;
  name?: string;
  bio?: string;
  phone?: string;
  email?: string;
  password?: string;
  isPrivate?: boolean;
  isAdmin?: boolean;
  provider?: string;
  providerId?: string
  adminStatusProvidedByUserId?: string
}

export interface IUserRequest extends IUser {
  confirmPassword: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ITokenUser {
  _id: string;
  email: string;
  phone?: string;
  isPrivate?: boolean;
  isAdmin?: boolean;
}

export interface IToggleIsAdmin{
    userId: string,
    isAdmin: boolean
}

export enum AUTH_PROVIDERS {
  GITHUB = 'github',
  CUSTOM = "custom",
}

export const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
