import apiClient from "./client";

export interface StaffAccount {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "super_admin" | "manager" | "staff";
  is_active: boolean;
  date_joined: string;
}

export interface StaffAccountInput {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: StaffAccount["role"];
  is_active: boolean;
  password?: string;
}

export const getStaffAccounts = async (): Promise<StaffAccount[]> => {
  const response = await apiClient.get<StaffAccount[]>("auth/staff-accounts/");
  return response.data;
};

export const createStaffAccount = async (
  data: StaffAccountInput
): Promise<StaffAccount> => {
  const response = await apiClient.post<StaffAccount>(
    "auth/staff-accounts/",
    data
  );
  return response.data;
};

export const updateStaffAccount = async (
  id: number,
  data: Partial<StaffAccountInput>
): Promise<StaffAccount> => {
  const response = await apiClient.patch<StaffAccount>(
    `auth/staff-accounts/${id}/`,
    data
  );
  return response.data;
};

export const deleteStaffAccount = async (id: number): Promise<void> => {
  await apiClient.delete(`auth/staff-accounts/${id}/`);
};

export const resetStaffPassword = async (
  id: number,
  password: string
): Promise<StaffAccount> => {
  const response = await apiClient.patch<StaffAccount>(
    `auth/staff-accounts/${id}/`,
    { password }
  );
  return response.data;
};