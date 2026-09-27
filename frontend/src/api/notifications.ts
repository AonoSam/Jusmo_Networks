import apiClient from "./client";

export interface NotificationItem {
  id: number;
  type: "enquiry" | "quotation";
  title: string;
  subtitle: string;
  created_at: string;
}

export interface NotificationsResponse {
  count: number;
  items: NotificationItem[];
}

export const getNotifications = async (): Promise<NotificationsResponse> =>
  (await apiClient.get<NotificationsResponse>("auth/notifications/")).data;