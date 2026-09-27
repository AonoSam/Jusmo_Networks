import apiClient from "./client";

export interface Company {
  id: number;
  name: string;
  tagline: string;
  description: string;

  mission: string;
  vision: string;
  values: string;

  phone: string;
  whatsapp: string;
  email: string;

  address: string;
  google_maps_url: string;

  facebook_url: string;
  linkedin_url: string;
  instagram_url: string;

  logo: string | null;

  created_at: string;
  updated_at: string;
}

export const getCompany = async (): Promise<Company> => {
  const response = await apiClient.get<Company[]>("company/");

  if (!response.data.length) {
    throw new Error("No company information found.");
  }

  return response.data[0];
};

export type CompanyTextFields = Omit<
  Company,
  "id" | "logo" | "created_at" | "updated_at"
>;

export const updateCompanyDetails = async (
  id: number,
  data: Partial<CompanyTextFields>
): Promise<Company> => {
  const response = await apiClient.patch<Company>(`company/${id}/`, data);
  return response.data;
};

export const updateCompanyLogo = async (
  id: number,
  logoFile: File
): Promise<Company> => {
  const formData = new FormData();
  formData.append("logo", logoFile);

  const response = await apiClient.patch<Company>(
    `company/${id}/`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};
