import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, Wrench, Inbox, FileText, MessageSquareQuote, ArrowRight } from "lucide-react";

import { getSummary, type Summary } from "../api/analytics";
import { getEnquiries, type Enquiry } from "../api/enquiries";

const statusStyles: Record<Enquiry["status"], string> = {
  new: "bg-blue-950 text-blue-400",
  in_progress: "bg-amber-950 text-amber-400",
  responded: "bg-green-950 text-green-400",
  closed: "bg-navy-900 text-navy-400",
};

function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [enquiriesError, setEnquiriesError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const summaryData = await getSummary();
        setSummary(summaryData);
      } catch (error) {
        console.error("Failed to load summary:", error);
      }

      try {
        const enquiries = await getEnquiries();
        setRecentEnquiries(enquiries.slice(0, 5));
      } catch (error) {
        console.error("Failed to load enquiries:", error);
        setEnquiriesError(true);
      }

      setLoading(false);
    };

    load();
  }, []);

  const cards = [
    { label: "Projects", value: summary?.projects, icon: FolderKanban },
    { label: "Services", value: summary?.services, icon: Wrench },
    { label: "Testimonials", value: summary?.testimonials, icon: MessageSquareQuote },
    { label: "Enquiries", value: summary?.enquiries, icon: Inbox },
    { label: "Quotations", value: summary?.quotations, icon: FileText },
  ];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-KE", { month: "short", day: "numeric" });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-navy-400">
        Overview of your website content and activity.
      </p>

      <div className="mt-8 grid gap-6 grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-navy-800 bg-navy-950 p-6"
          >
            <div className="flex items-center justify-between">
              <card.icon size={22} className="text-gold-500" />
            </div>

            <p className="mt-4 text-3xl font-bold text-white">
              {loading ? "…" : card.value ?? "—"}
            </p>

            <p className="mt-1 text-sm text-navy-400">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-navy-800 bg-navy-950 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Enquiries</h2>

          <Link
            to="/staff/enquiries"
            className="inline-flex items-center gap-1 text-sm font-semibold text-gold-500 hover:text-gold-600"
          >
            View all
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-navy-400">Loading enquiries...</p>
        ) : enquiriesError ? (
          <p className="mt-4 text-sm text-red-400">
            Failed to load enquiries.
          </p>
        ) : recentEnquiries.length === 0 ? (
          <p className="mt-4 text-sm text-navy-400">No enquiries yet.</p>
        ) : (
          <div className="mt-4 divide-y divide-navy-900">
            {recentEnquiries.map((enquiry) => (
              <Link
                key={enquiry.id}
                to="/staff/enquiries"
                className="flex items-center justify-between gap-4 py-3 transition hover:bg-navy-900 -mx-2 px-2 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {enquiry.name}
                  </p>
                  <p className="truncate text-sm text-navy-400">
                    {enquiry.subject}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[enquiry.status]}`}>
                    {enquiry.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-navy-500">
                    {formatDate(enquiry.created_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;