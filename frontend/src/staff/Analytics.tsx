import { useEffect, useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import {
  getSummary,
  getEnquiriesMonthly,
  getQuotationsMonthly,
  getTopServices,
  getProjectCategories,
  getConversion,
  type Summary,
  type MonthlyPoint,
  type NamedCount,
  type Conversion,
} from "../api/analytics";
import SimpleBarChart from "./SimpleBarChart";
import SimpleMultiBarChart from "./SimpleMultiBarChart";
import SimpleMultiLineChart from "./SimpleMultiLineChart";

function Analytics() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [enquiriesMonthly, setEnquiriesMonthly] = useState<MonthlyPoint[]>([]);
  const [quotationsMonthly, setQuotationsMonthly] = useState<MonthlyPoint[]>([]);
  const [topServices, setTopServices] = useState<NamedCount[]>([]);
  const [categories, setCategories] = useState<NamedCount[]>([]);
  const [conversion, setConversion] = useState<Conversion | null>(null);
  const [loading, setLoading] = useState(true);
  const [combinedView, setCombinedView] = useState<"bar" | "line">("line");

  useEffect(() => {
    const load = async () => {
      try {
        const [s, em, qm, ts, pc, cv] = await Promise.all([
          getSummary(),
          getEnquiriesMonthly(),
          getQuotationsMonthly(),
          getTopServices(),
          getProjectCategories(),
          getConversion(),
        ]);
        setSummary(s);
        setEnquiriesMonthly(em);
        setQuotationsMonthly(qm);
        setTopServices(ts);
        setCategories(pc);
        setConversion(cv);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p className="text-navy-300">Loading analytics...</p>;
  }

  const summaryCards = summary
    ? [
        { label: "Projects", value: summary.projects },
        { label: "Services", value: summary.services },
        { label: "Testimonials", value: summary.testimonials },
        { label: "Enquiries", value: summary.enquiries },
        { label: "Quotation Requests", value: summary.quotations },
      ]
    : [];

  const combinedSeries = [
    { name: "Enquiries", color: "var(--color-gold-500)", data: enquiriesMonthly },
    { name: "Quotations", color: "#60A5FA", data: quotationsMonthly },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Analytics</h1>
      <p className="mt-1 text-sm text-navy-300">Website performance overview.</p>

      <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-5">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-navy-800 bg-navy-900 p-5">
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="mt-1 text-xs font-medium text-navy-300">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-navy-800 bg-navy-900 p-6">
          <h2 className="text-lg font-bold text-white">Enquiries — Last 6 Months</h2>
          <div className="mt-6">
            <SimpleBarChart data={enquiriesMonthly} />
          </div>
        </div>

        <div className="rounded-2xl border border-navy-800 bg-navy-900 p-6">
          <h2 className="text-lg font-bold text-white">Quotations — Last 6 Months</h2>
          <div className="mt-6">
            <SimpleBarChart data={quotationsMonthly} />
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-navy-800 bg-navy-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Enquiries vs Quotations Trend</h2>

          <div className="flex items-center gap-1 rounded-lg border border-navy-700 p-1">
            <button
              type="button"
              onClick={() => setCombinedView("bar")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                combinedView === "bar"
                  ? "bg-gold-500 text-navy-950"
                  : "text-navy-300 hover:text-white"
              }`}
            >
              <BarChart3 size={14} />
              Bar
            </button>
            <button
              type="button"
              onClick={() => setCombinedView("line")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                combinedView === "line"
                  ? "bg-gold-500 text-navy-950"
                  : "text-navy-300 hover:text-white"
              }`}
            >
              <TrendingUp size={14} />
              Line
            </button>
          </div>
        </div>

        <div className="mt-6">
          {combinedView === "bar" ? (
            <SimpleMultiBarChart series={combinedSeries} />
          ) : (
            <SimpleMultiLineChart series={combinedSeries} />
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-navy-800 bg-navy-900 p-6">
          <h2 className="text-lg font-bold text-white">Most Requested Services</h2>
          <div className="mt-4 space-y-3">
            {topServices.length === 0 ? (
              <p className="text-sm text-navy-400">No quotation requests yet.</p>
            ) : (
              topServices.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-navy-100">{s.name}</span>
                  <span className="font-bold text-gold-500">{s.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-navy-800 bg-navy-900 p-6">
          <h2 className="text-lg font-bold text-white">Project Categories</h2>
          <div className="mt-4 space-y-3">
            {categories.length === 0 ? (
              <p className="text-sm text-navy-400">No projects yet.</p>
            ) : (
              categories.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-navy-100">{c.name}</span>
                  <span className="font-bold text-gold-500">{c.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {conversion && (
        <div className="mt-8 rounded-2xl border border-navy-800 bg-navy-900 p-6">
          <h2 className="text-lg font-bold text-white">Enquiry → Quotation Conversion</h2>
          <p className="mt-2 text-3xl font-bold text-gold-500">{conversion.rate}%</p>
          <p className="mt-1 text-sm text-navy-300">{conversion.note}</p>
        </div>
      )}
    </div>
  );
}

export default Analytics;