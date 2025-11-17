import api from './client';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login/', payload);
  return data;
}
