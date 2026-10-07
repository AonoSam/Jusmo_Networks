import { useEffect, useState } from "react";
import { getAuditLogs, type AuditLogEntry } from "../api/auditlog";

const actionStyles: Record<AuditLogEntry["action"], string> = {
  create: "bg-green-950 text-green-400",
  update: "bg-blue-950 text-blue-400",
  delete: "bg-red-950 text-red-400",
  login: "bg-navy-800 text-navy-100",
  logout: "bg-navy-900 text-navy-400",
  login_failed: "bg-amber-950 text-amber-400",
};

function AuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-KE", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Audit Log</h1>
      <p className="mt-1 text-sm text-navy-300">
        A record of who changed what, when, and from which IP address.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-navy-800 bg-navy-950">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-6 text-navy-300">Loading audit log...</p>
          ) : logs.length === 0 ? (
            <p className="p-6 text-navy-300">No activity recorded yet.</p>
          ) : (
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-navy-800 text-left text-navy-300">
                  <th className="px-6 py-3 font-semibold">User</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                  <th className="px-6 py-3 font-semibold">Item</th>
                  <th className="px-6 py-3 font-semibold">IP Address</th>
                  <th className="px-6 py-3 font-semibold">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <>
                    <tr
                      key={log.id}
                      onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                      className="cursor-pointer border-b border-navy-900 last:border-0 transition hover:bg-navy-900"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {log.actor_username || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${actionStyles[log.action]}`}>
                          {log.action.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-navy-100">
                        {log.model_name ? `${log.model_name} — ${log.object_repr}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-navy-300">{log.ip_address || "—"}</td>
                      <td className="px-6 py-4 text-navy-300">{formatDate(log.created_at)}</td>
                    </tr>

                    {expanded === log.id && log.changes && (
                      <tr className="border-b border-navy-900 bg-navy-900/50">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="space-y-1 text-xs">
                            {Object.entries(log.changes).map(([field, change]) => (
                              <div key={field} className="flex gap-2">
                                <span className="font-semibold text-gold-500">{field}:</span>
                                <span className="text-navy-400 line-through">{change.before}</span>
                                <span className="text-navy-100">→ {change.after}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditLog;