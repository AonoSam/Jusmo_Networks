import { useState } from "react";
import { Outlet } from "react-router-dom";

import StaffSidebar from "./StaffSidebar";
import StaffHeader from "./StaffHeader";

function StaffLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-navy-900">
      <StaffSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        <StaffHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StaffLayout;