import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import StaffLayout from "./staff/StaffLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import RequestQuote from "./pages/RequestQuote";
import Contact from "./pages/Contact";

import StaffLogin from "./staff/StaffLogin";
import Dashboard from "./staff/Dashboard";
import Analytics from "./staff/Analytics";
import CompanyManagement from "./staff/CompanyManagement";
import ServicesManagement from "./staff/ServicesManagement";
import ProjectsManagement from "./staff/ProjectsManagement";
import TestimonialsManagement from "./staff/TestimonialsManagement";
import EnquiriesManagement from "./staff/EnquiriesManagement";
import QuotationsManagement from "./staff/QuotationsManagement";
import StaffManagement from "./staff/StaffManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetails />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/quote" element={<RequestQuote />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/staff/login" element={<StaffLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<StaffLayout />}>
            <Route path="/staff/dashboard" element={<Dashboard />} />
            <Route path="/staff/enquiries" element={<EnquiriesManagement />} />
            <Route path="/staff/quotations" element={<QuotationsManagement />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["super_admin", "manager"]} />}>
          <Route element={<StaffLayout />}>
            <Route path="/staff/analytics" element={<Analytics />} />
            <Route path="/staff/company" element={<CompanyManagement />} />
            <Route path="/staff/services" element={<ServicesManagement />} />
            <Route path="/staff/projects" element={<ProjectsManagement />} />
            <Route path="/staff/testimonials" element={<TestimonialsManagement />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
          <Route element={<StaffLayout />}>
            <Route path="/staff/users" element={<StaffManagement />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;