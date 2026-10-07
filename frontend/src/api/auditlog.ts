import apiClient from "./client";

export interface AuditLogEntry {
  id: number;
  actor_username: string;
  action: "create" | "update" | "delete" | "login" | "logout" | "login_failed";
  model_name: string;
  object_id: string;
  object_repr: string;
  changes: Record<string, { before: string; after: string }> | null;
  ip_address: string | null;
  user_agent: string;
  created_at: string;
}

export const getAuditLogs = async (): Promise<AuditLogEntry[]> => {
  const response = await apiClient.get<AuditLogEntry[]>("audit/logs/");
  return response.data;
};