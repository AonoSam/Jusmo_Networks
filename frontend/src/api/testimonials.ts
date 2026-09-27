import apiClient from "./client";

export interface Testimonial {
  id: number;
  name: string;
  company_name: string;
  role: string;
  content: string;
  rating: number;
  image: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await apiClient.get<Testimonial[]>("testimonials/");
  return response.data;
};

export interface TestimonialInput {
  name: string;
  company_name: string;
  role: string;
  content: string;
  rating: number;
  is_published: boolean;
  display_order: number;
}

export const createTestimonial = async (
  data: TestimonialInput
): Promise<Testimonial> => {
  const response = await apiClient.post<Testimonial>("testimonials/", data);
  return response.data;
};

export const updateTestimonial = async (
  id: number,
  data: Partial<TestimonialInput>
): Promise<Testimonial> => {
  const response = await apiClient.patch<Testimonial>(`testimonials/${id}/`, data);
  return response.data;
};

export const deleteTestimonial = async (id: number): Promise<void> => {
  await apiClient.delete(`testimonials/${id}/`);
};

export const updateTestimonialImage = async (
  id: number,
  imageFile: File
): Promise<Testimonial> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await apiClient.patch<Testimonial>(
    `testimonials/${id}/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data;
};