import { useEffect, useState } from "react";

import { getServices, type Service } from "../api/services";

import ServicesHero from "../components/services/ServicesHero";
import ServicesGrid from "../components/services/ServicesGrid";

function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
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
    <>
      <ServicesHero />

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              Loading services...
            </div>
          ) : (
            <ServicesGrid services={services} hasError={hasError} />
          )}
        </div>
      </section>
    </>
  );
}

export default Services;