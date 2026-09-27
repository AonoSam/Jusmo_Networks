import apiClient from "./client";

export interface Summary {
  projects: number;
  services: number;
  testimonials: number;
  enquiries: number;
  quotations: number;
}

export interface MonthlyPoint {
  month: string;
  count: number;
}

export interface NamedCount {
  name: string;
  count: number;
}

export interface Conversion {
  enquiries: number;
  quotations: number;
  rate: number;
  note: string;
}

export const getSummary = async (): Promise<Summary> =>
  (await apiClient.get<Summary>("analytics/summary/")).data;

export const getEnquiriesMonthly = async (): Promise<MonthlyPoint[]> =>
  (await apiClient.get<MonthlyPoint[]>("analytics/enquiries-monthly/")).data;

export const getQuotationsMonthly = async (): Promise<MonthlyPoint[]> =>
  (await apiClient.get<MonthlyPoint[]>("analytics/quotations-monthly/")).data;

export const getTopServices = async (): Promise<NamedCount[]> =>
  (await apiClient.get<NamedCount[]>("analytics/top-services/")).data;

export const getProjectCategories = async (): Promise<NamedCount[]> =>
  (await apiClient.get<NamedCount[]>("analytics/project-categories/")).data;

export const getConversion = async (): Promise<Conversion> =>
  (await apiClient.get<Conversion>("analytics/conversion/")).data;