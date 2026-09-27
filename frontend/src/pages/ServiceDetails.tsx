import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getService, type Service } from "../api/services";
import ServiceIcon from "../components/services/ServiceIcon";
import CTA from "../components/home/CTA";

function ServiceDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadService = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const data = await getService(slug);
        setService(data);
      } catch (error) {
        console.error("Failed to load service:", error);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">Loading service...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <section className="px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-slate-950">
            Service not found
          </h1>
          <p className="mt-4 text-slate-600">
            The service you are looking for could not be found.
          </p>
          <Link
            to="/services"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded"
          >
            <ArrowLeft size={18} />
            Back to Services
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-950 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 rounded"
          >
            <ArrowLeft size={17} />
            Back to Services
          </Link>

          <div className="mt-12 max-w-4xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-800 text-gold-500">
              <ServiceIcon name={service.name} icon={service.icon} size={26} />
            </div>

            <h1 className="mt-7 break-words text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {service.name}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-navy-300">
              {service.short_description}
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-3">
            {/* Description */}
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Service Overview
              </p>
              <h2 className="mt-4 text-3xl font-bold text-slate-950">
                Professional solutions built around your needs
              </h2>
              <p className="mt-7 whitespace-pre-line break-words text-lg leading-9 text-slate-600">
                {service.description}
              </p>
            </div>

            {/* Service information */}
            <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-7">
              <h2 className="text-xl font-bold text-slate-950">
                Service Information
              </h2>

              <div className="mt-7 space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Availability
                  </p>
                  <p className="mt-2 font-medium text-slate-900">
                    {service.is_active ? "Available" : "Currently unavailable"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Service
                  </p>
                  <p className="mt-2 break-words font-medium text-slate-900">
                    {service.name}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTA
        eyebrow="Get Started"
        title={`Need ${service.name}?`}
        description="Tell us about your requirements and our team will help you find the right solution for your business."
      />
    </>
  );
}

export default ServiceDetails;