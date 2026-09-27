import apiClient from "./client";

export interface ProjectImage {
  id: number;
  image: string;
  caption: string;
  display_order: number;
}

export interface ProjectService {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  client_name: string;
  services: ProjectService[];
  project_date: string | null;
  status: "completed" | "ongoing" | "planned";
  featured: boolean;
  is_published: boolean;
  images: ProjectImage[];
  created_at: string;
  updated_at: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>("projects/");
  return response.data;
};

export const getProject = async (slug: string): Promise<Project> => {
  const response = await apiClient.get<Project>(`projects/${slug}/`);
  return response.data;
};

export interface ProjectInput {
  title: string;
  description: string;
  category: string;
  location: string;
  client_name: string;
  services: number[];
  project_date: string | null;
  status: Project["status"];
  featured: boolean;
  is_published: boolean;
}

export const createProject = async (
  data: ProjectInput
): Promise<Project> => {
  const response = await apiClient.post<Project>("projects/", data);
  return response.data;
};

export const updateProject = async (
  slug: string,
  data: Partial<ProjectInput>
): Promise<Project> => {
  const response = await apiClient.patch<Project>(`projects/${slug}/`, data);
  return response.data;
};

export const deleteProject = async (slug: string): Promise<void> => {
  await apiClient.delete(`projects/${slug}/`);
};

export const uploadProjectImage = async (
  slug: string,
  file: File,
  caption: string = "",
  displayOrder: number = 0
): Promise<ProjectImage> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("caption", caption);
  formData.append("display_order", String(displayOrder));

  const response = await apiClient.post<ProjectImage>(
    `projects/${slug}/upload_image/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data;
};

export const deleteProjectImage = async (
  slug: string,
  imageId: number
): Promise<void> => {
  await apiClient.delete(`projects/${slug}/images/${imageId}/`);
};