export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
} 