import apiClient from "./client";

export interface Enquiry {
  id: number;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "responded" | "closed";
  created_at: string;
  updated_at?: string;
}

export interface EnquiryData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export const submitEnquiry = async (
  enquiryData: EnquiryData
): Promise<Enquiry> => {
  const response = await apiClient.post<Enquiry>(
    "enquiries/",
    enquiryData
  );

  return response.data;
};

export const getEnquiries = async (): Promise<Enquiry[]> => {
  const response = await apiClient.get<Enquiry[]>("enquiries/");
  return response.data;
};

export const getEnquiry = async (id: number): Promise<Enquiry> => {
  const response = await apiClient.get<Enquiry>(`enquiries/${id}/`);
  return response.data;
};

export const updateEnquiryStatus = async (
  id: number,
  status: Enquiry["status"]
): Promise<Enquiry> => {
  const response = await apiClient.patch<Enquiry>(`enquiries/${id}/`, {
    status,
  });
  return response.data;
};