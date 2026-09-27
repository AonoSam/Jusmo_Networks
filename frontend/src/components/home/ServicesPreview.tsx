import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getServices, type Service } from "../../api/services";
import ServiceIcon from "../services/ServiceIcon";

function ServicesPreview() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to load services:", error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  return (
    <section className="bg-navy-950 border-t border-navy-800 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-500">
              What We Do
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-5 text-lg leading-8 text-navy-300">
              Professional technology and infrastructure services designed to
              support reliable business operations.
            </p>
          </div>

          {!loading && !hasError && services.length > 0 && (
            <Link
              to="/services"
              className="inline-flex items-center gap-2 font-semibold text-gold-500 hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 rounded"
            >
              View all services
              <ArrowRight size={18} />
            </Link>
          )}
        </div>

        {loading && (
          <div className="mt-12 text-navy-400">Loading services...</div>
        )}

        {!loading && hasError && (
          <div className="mt-12 rounded-2xl border border-dashed border-navy-700 bg-navy-900 p-12 text-center">
            <h3 className="text-lg font-semibold text-white">
              Services couldn't be loaded
            </h3>
            <p className="mt-2 text-navy-400">
              Something went wrong on our end — please refresh the page.
            </p>
          </div>
        )}

        {!loading && !hasError && services.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-navy-700 bg-navy-900 p-12 text-center">
            <h3 className="text-lg font-semibold text-white">
              Services coming soon
            </h3>
            <p className="mt-2 text-navy-400">
              Our full service lineup will appear here.
            </p>
          </div>
        )}

        {!loading && !hasError && services.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-navy-800 bg-navy-900 p-7 transition hover:-translate-y-1 hover:border-gold-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-800 text-gold-500">
                    <ServiceIcon name={service.name} icon={service.icon} />
                  </div>
                  <span
                    className="text-navy-600 transition group-hover:text-gold-500"
                    aria-hidden="true"
                  >
                    <ArrowUpRight size={20} />
                  </span>
                </div>

                <h3 className="mt-7 line-clamp-2 break-words text-xl font-bold text-white">
                  {service.name}
                </h3>
                <p className="mt-3 line-clamp-3 break-words leading-7 text-navy-300">
                  {service.short_description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ServicesPreview;