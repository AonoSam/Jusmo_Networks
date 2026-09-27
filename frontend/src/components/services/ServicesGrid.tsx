import type { Service } from "../../api/services";
import ServiceCard from "./ServiceCard";

interface ServicesGridProps {
  services: Service[];
  hasError?: boolean;
}

function ServicesGrid({ services, hasError = false }: ServicesGridProps) {
  if (hasError) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          Services couldn't be loaded
        </h3>
        <p className="mt-2 text-slate-500">
          Something went wrong on our end — please refresh the page.
        </p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          No services available
        </h3>
        <p className="mt-2 text-slate-500">
          Services will appear here once they are published.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}

export default ServicesGrid;