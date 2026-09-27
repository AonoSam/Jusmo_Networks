import { useEffect, useState } from "react";
import { X, Mail, Phone } from "lucide-react";

import {
  getEnquiries,
  updateEnquiryStatus,
  type Enquiry,
} from "../api/enquiries";

const statusOptions: Enquiry["status"][] = ["new", "in_progress", "responded", "closed"];

const statusStyles: Record<Enquiry["status"], string> = {
  new: "bg-blue-950 text-blue-400",
  in_progress: "bg-amber-950 text-amber-400",
  responded: "bg-green-950 text-green-400",
  closed: "bg-navy-900 text-navy-400",
};

function EnquiriesManagement() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Enquiry["status"]>("all");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadEnquiries = async () => {
    try {
      const data = await getEnquiries();
      setEnquiries(data);
    } catch (error) {
      console.error("Failed to load enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const filtered = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  const handleStatusChange = async (enquiry: Enquiry, status: Enquiry["status"]) => {
    setUpdating(true);
    try {
      const updated = await updateEnquiryStatus(enquiry.id, status);
      setEnquiries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      setSelected(updated);
    } catch (error) {
      console.error("Failed to update enquiry status:", error);
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-white">Enquiries</h1>
        <p className="mt-1 text-sm text-navy-400">
          General enquiries submitted through the Contact page.
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
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-navy-800 bg-navy-950">
        <div className="overflow-x-auto">
         {loading ? (
          <p className="p-6 text-navy-400">Loading enquiries...</p>
         ) : filtered.length === 0 ? (
          <p className="p-6 text-navy-400">No enquiries found.</p>
         ) : (
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-navy-800 text-left text-navy-400">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Subject</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enquiry) => (
                <tr
                  key={enquiry.id}
                  onClick={() => setSelected(enquiry)}
                  className="cursor-pointer border-b border-navy-900 last:border-0 transition hover:bg-navy-900"
                >
                  <td className="px-6 py-4 text-white">{enquiry.name}</td>
                  <td className="px-6 py-4 text-navy-300">{enquiry.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[enquiry.status]}`}>
                      {enquiry.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-navy-400">{formatDate(enquiry.created_at)}</td>
                </tr>
              ))}
            </tbody>
           </table>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-lg rounded-2xl border border-navy-800 bg-navy-950 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{selected.subject}</h2>
              <button type="button" onClick={() => setSelected(null)} className="text-navy-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <p className="text-white font-medium">{selected.name}</p>

              <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-navy-300 hover:text-gold-500">
                <Mail size={15} />
                {selected.email}
              </a>

              <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-navy-300 hover:text-gold-500">
                <Phone size={15} />
                {selected.phone}
              </a>

              <p className="mt-4 whitespace-pre-line leading-6 text-navy-200">{selected.message}</p>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-navy-200">Status</label>
              <select
                value={selected.status}
                disabled={updating}
                onChange={(e) => handleStatusChange(selected, e.target.value as Enquiry["status"])}
                className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 disabled:opacity-60"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
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

export default EnquiriesManagement;