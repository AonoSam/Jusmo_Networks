import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function NotificationBell() {
  const { count, items } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-navy-300 transition hover:bg-navy-900 hover:text-gold-500"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-navy-950">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-80 rounded-lg border border-navy-800 bg-navy-900 shadow-lg">
          <div className="border-b border-navy-800 px-4 py-3">
            <p className="text-sm font-semibold text-white">Notifications</p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-navy-500">
                No new notifications.
              </p>
            ) : (
              items.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  to={item.type === "enquiry" ? "/staff/enquiries" : "/staff/quotations"}
                  onClick={() => setOpen(false)}
                  className="block border-b border-navy-800 px-4 py-3 transition last:border-0 hover:bg-navy-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-white">{item.title}</p>
                    <span className="shrink-0 text-xs text-navy-500">{timeAgo(item.created_at)}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-navy-400">
                    {item.type === "enquiry" ? "New enquiry — " : "New quotation — "}
                    {item.subtitle}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;