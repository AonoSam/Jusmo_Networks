import { useState } from "react";
import { ChevronDown, LogOut, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";
import NotificationBell from "./NotificationBell";

interface StaffHeaderProps {
  onMenuClick: () => void;
}

function StaffHeader({ onMenuClick }: StaffHeaderProps) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/staff/login", { replace: true });
  };

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "Staff";

  const roleLabel = user?.role
    ? user.role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  return (
    <header className="flex h-16 items-center justify-between border-b border-navy-800 bg-navy-950 px-4 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-300 transition hover:bg-navy-900 hover:text-white md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:block">
          <ThemeToggle variant="dark" />
        </div>
        <NotificationBell />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-navy-900 sm:gap-3 sm:px-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-navy-950">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-white">{displayName}</p>
            <p className="text-xs text-navy-400">{roleLabel}</p>
          </div>

          <ChevronDown size={16} className="hidden text-navy-400 sm:block" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-navy-800 bg-navy-900 py-1 shadow-lg">
            <div className="border-b border-navy-800 px-4 py-2 sm:hidden">
              <p className="text-sm font-medium text-white">{displayName}</p>
              <p className="text-xs text-navy-400">{roleLabel}</p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 text-sm text-navy-300">
              <User size={15} />
              {user?.email}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-400 transition hover:bg-navy-800"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default StaffHeader;