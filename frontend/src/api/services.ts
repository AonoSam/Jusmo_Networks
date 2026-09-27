import apiClient from "./client";

export interface Service {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  icon: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const getServices = async (): Promise<Service[]> => {
  const response = await apiClient.get<Service[]>("services/");
  return response.data;
};

export const getService = async (slug: string): Promise<Service> => {
  const response = await apiClient.get<Service>(`services/${slug}/`);
  return response.data;
};

export type ServiceInput = Omit<
  Service,
  "id" | "slug" | "created_at" | "updated_at"
>;

export const createService = async (
  data: ServiceInput
): Promise<Service> => {
  const response = await apiClient.post<Service>("services/", data);
  return response.data;
};

export const updateService = async (
  slug: string,
  data: Partial<ServiceInput>
): Promise<Service> => {
  const response = await apiClient.patch<Service>(`services/${slug}/`, data);
  return response.data;
};

export const deleteService = async (slug: string): Promise<void> => {
  await apiClient.delete(`services/${slug}/`);
};