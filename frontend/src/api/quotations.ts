import apiClient from "./client";

export interface Quotation {
  id: number;
  client_name: string;
  company_name: string;
  phone: string;
  email: string;
  location: string;
  service: number;
  service_name?: string;
  project_description: string;
  preferred_project_date: string | null;
  budget_range: string;
  additional_comments: string;
  status:
    | "new"
    | "reviewing"
    | "contacted"
    | "quoted"
    | "accepted"
    | "rejected"
    | "completed";
  created_at: string;
  updated_at?: string;
}

export interface QuotationData {
  client_name: string;
  company_name: string;
  phone: string;
  email: string;
  location: string;
  service: number;
  project_description: string;
  preferred_project_date: string | null;
  budget_range: string;
  additional_comments: string;
}

export const submitQuotation = async (
  quotationData: QuotationData
): Promise<Quotation> => {
  const response = await apiClient.post<Quotation>(
    "quotations/",
    quotationData
  );

  return response.data;
};

export const getQuotations = async (): Promise<Quotation[]> => {
  const response = await apiClient.get<Quotation[]>("quotations/");
  return response.data;
};

export const getQuotation = async (id: number): Promise<Quotation> => {
  const response = await apiClient.get<Quotation>(`quotations/${id}/`);
  return response.data;
};

export const updateQuotationStatus = async (
  id: number,
  status: Quotation["status"]
): Promise<Quotation> => {
  const response = await apiClient.patch<Quotation>(`quotations/${id}/`, {
    status,
  });
  return response.data;
};