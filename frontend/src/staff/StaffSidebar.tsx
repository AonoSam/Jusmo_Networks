import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Wrench,
  FolderKanban,
  MessageSquareQuote,
  Inbox,
  FileText,
  Users,
  BarChart3,
  X,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

const navItems = [
  { name: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard, roles: ["super_admin", "manager", "staff"] },
  { name: "Analytics", path: "/staff/analytics", icon: BarChart3, roles: ["super_admin", "manager"] },
  { name: "Company", path: "/staff/company", icon: Building2, roles: ["super_admin", "manager"] },
  { name: "Services", path: "/staff/services", icon: Wrench, roles: ["super_admin", "manager"] },
  { name: "Projects", path: "/staff/projects", icon: FolderKanban, roles: ["super_admin", "manager"] },
  { name: "Testimonials", path: "/staff/testimonials", icon: MessageSquareQuote, roles: ["super_admin", "manager"] },
  { name: "Enquiries", path: "/staff/enquiries", icon: Inbox, roles: ["super_admin", "manager", "staff"] },
  { name: "Quotations", path: "/staff/quotations", icon: FileText, roles: ["super_admin", "manager", "staff"] },
  { name: "Staff", path: "/staff/users", icon: Users, roles: ["super_admin"] },
];

interface StaffSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function StaffSidebar({ isOpen, onClose }: StaffSidebarProps) {
  const { user } = useAuth();

  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-navy-800 bg-navy-950
          transition-transform duration-300 ease-in-out
          md:sticky md:top-0 md:h-screen md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-lg font-bold text-white">
              JUSMO<span className="text-gold-500"> NETWORKS</span>
            </h1>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-navy-500">
              Staff Portal
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-navy-400 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-gold-500 text-navy-950"
                    : "text-navy-300 hover:bg-navy-900 hover:text-white"
                }`
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default StaffSidebar;