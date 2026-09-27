import { useEffect, useState } from "react";
import { X, Mail, Phone, MapPin } from "lucide-react";

import {
  getQuotations,
  updateQuotationStatus,
  type Quotation,
} from "../api/quotations";

const statusOptions: Quotation["status"][] = [
  "new", "reviewing", "contacted", "quoted", "accepted", "rejected", "completed",
];

const statusStyles: Record<Quotation["status"], string> = {
  new: "bg-blue-950 text-blue-400",
  reviewing: "bg-amber-950 text-amber-400",
  contacted: "bg-purple-950 text-purple-400",
  quoted: "bg-gold-50 text-gold-700",
  accepted: "bg-green-950 text-green-400",
  rejected: "bg-red-950 text-red-400",
  completed: "bg-navy-900 text-navy-400",
};

function QuotationsManagement() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Quotation["status"]>("all");
  const [selected, setSelected] = useState<Quotation | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadQuotations = async () => {
    try {
      const data = await getQuotations();
      setQuotations(data);
    } catch (error) {
      console.error("Failed to load quotations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotations();
  }, []);

  const filtered = filter === "all" ? quotations : quotations.filter((q) => q.status === filter);

  const handleStatusChange = async (quotation: Quotation, status: Quotation["status"]) => {
    setUpdating(true);
    try {
      const updated = await updateQuotationStatus(quotation.id, status);
      setQuotations((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      setSelected(updated);
    } catch (error) {
      console.error("Failed to update quotation status:", error);
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })
      : "—";

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-white">Quotations</h1>
        <p className="mt-1 text-sm text-navy-400">
          Quote requests submitted through the Request a Quote page.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", ...statusOptions] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
              filter === status
                ? "bg-gold-500 text-navy-950"
                : "border border-navy-700 text-navy-300 hover:bg-navy-900"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-navy-800 bg-navy-950">
        <div className="overflow-x-auto">
         {loading ? (
          <p className="p-6 text-navy-400">Loading quotations...</p>
         ) : filtered.length === 0 ? (
          <p className="p-6 text-navy-400">No quotations found.</p>
         ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-navy-800 text-left text-navy-400">
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Service</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((quotation) => (
                <tr
                  key={quotation.id}
                  onClick={() => setSelected(quotation)}
                  className="cursor-pointer border-b border-navy-900 last:border-0 transition hover:bg-navy-900"
                >
                  <td className="px-6 py-4">
                    <p className="text-white">{quotation.client_name}</p>
                    {quotation.company_name && (
                      <p className="text-xs text-navy-500">{quotation.company_name}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-navy-300">{quotation.service_name || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[quotation.status]}`}>
                      {quotation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-navy-400">{formatDate(quotation.created_at)}</td>
                </tr>
              ))}
            </tbody>
           </table>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 py-10 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-navy-800 bg-navy-950 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{selected.client_name}</h2>
              <button type="button" onClick={() => setSelected(null)} className="text-navy-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              {selected.company_name && (
                <p className="text-navy-300">{selected.company_name}</p>
              )}

              <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-navy-300 hover:text-gold-500">
                <Mail size={15} />
                {selected.email}
              </a>

              <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-navy-300 hover:text-gold-500">
                <Phone size={15} />
                {selected.phone}
              </a>

              <div className="flex items-center gap-2 text-navy-300">
                <MapPin size={15} />
                {selected.location}
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-navy-800 pt-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-navy-500">Service</p>
                  <p className="mt-1 text-navy-100">{selected.service_name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-navy-500">Preferred Date</p>
                  <p className="mt-1 text-navy-100">{formatDate(selected.preferred_project_date)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-navy-500">Budget Range</p>
                  <p className="mt-1 text-navy-100">{selected.budget_range || "—"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-navy-500">Project Description</p>
                <p className="mt-1 whitespace-pre-line leading-6 text-navy-200">{selected.project_description}</p>
              </div>

              {selected.additional_comments && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-navy-500">Additional Comments</p>
                  <p className="mt-1 whitespace-pre-line leading-6 text-navy-200">{selected.additional_comments}</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-navy-200">Status</label>
              <select
                value={selected.status}
                disabled={updating}
                onChange={(e) => handleStatusChange(selected, e.target.value as Quotation["status"])}
                className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 disabled:opacity-60"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuotationsManagement;