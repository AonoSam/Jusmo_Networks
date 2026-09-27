import apiClient from "./client";

export interface StaffUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "super_admin" | "manager" | "staff";
}

export interface LoginResponse {
  user: StaffUser;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export const staffLogin = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "auth/login/",
    credentials
  );
  return response.data;
};

export const staffLogout = async (): Promise<void> => {
  await apiClient.post("auth/logout/");
};

export const getCurrentUser = async (): Promise<StaffUser> => {
  const response = await apiClient.get<StaffUser>("auth/me/");
  return response.data;
};