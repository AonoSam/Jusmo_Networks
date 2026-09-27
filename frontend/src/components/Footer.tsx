import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { useCompany } from "../hooks/useCompany";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import {
  getServices,
  type Service,
} from "../api/services";

function Footer() {
  const { company, loading: companyLoading } =
    useCompany();

  const [services, setServices] = useState<Service[]>(
    []
  );

  const [servicesLoading, setServicesLoading] =
    useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();

        setServices(
          data.filter((service) => service.is_active)
        );
      } catch (error) {
        console.error(
          "Failed to load services:",
          error
        );
      } finally {
        setServicesLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Company */}
          <div>
            <h2 className="text-xl font-bold text-white">
              {company?.name || "JUSMO NETWORKS"}
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              {company?.tagline ||
                "Your Technology & Infrastructure Partner."}
            </p>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              {company?.description ||
                "Delivering reliable technology, networking, telecommunications and infrastructure solutions."}
            </p>

            {/* Social Media */}
            <div className="mt-6 flex items-center gap-3">
              {company?.facebook_url && (
                <a
                  href={company.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-xs font-bold transition hover:border-blue-500 hover:text-white"
                >
                  FB
                </a>
              )}

              {company?.linkedin_url && (
                <a
                  href={company.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-xs font-bold transition hover:border-blue-500 hover:text-white"
                >
                  in
                </a>
              )}

              {company?.instagram_url && (
                <a
                  href={company.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-xs font-bold transition hover:border-blue-500 hover:text-white"
                >
                  IG
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link
                to="/"
                className="hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="hover:text-white"
              >
                About Us
              </Link>

              <Link
                to="/services"
                className="hover:text-white"
              >
                Services
              </Link>

              <Link
                to="/projects"
                className="hover:text-white"
              >
                Projects
              </Link>

              <Link
                to="/contact"
                className="hover:text-white"
              >
                Contact
              </Link>

              <Link
                to="/quote"
                className="hover:text-white"
              >
                Request a Quote
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white">
              Services
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              {servicesLoading ? (
                <span>Loading services...</span>
              ) : services.length > 0 ? (
                services.slice(0, 6).map((service) => (
                  <Link
                    key={service.id}
                    to={`/services/${service.slug}`}
                    className="transition hover:text-white"
                  >
                    {service.name}
                  </Link>
                ))
              ) : (
                <span>
                  No services available.
                </span>
              )}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white">
              Contact
            </h3>

            <div className="mt-4 space-y-4 text-sm">

              {/* Address */}
              {!companyLoading &&
                company?.address && (
                  <div className="flex gap-3">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-500"
                    />

                    <span>
                      {company.address}
                    </span>
                  </div>
                )}

              {/* Phone */}
              {!companyLoading &&
                company?.phone && (
                  <div className="flex gap-3">
                    <Phone
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-500"
                    />

                    <a
                      href={`tel:${company.phone}`}
                      className="transition hover:text-white"
                    >
                      {company.phone}
                    </a>
                  </div>
                )}

              {/* Email */}
              {!companyLoading &&
                company?.email && (
                  <div className="flex gap-3">
                    <Mail
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-500"
                    />

                    <a
                      href={`mailto:${company.email}`}
                      className="break-all transition hover:text-white"
                    >
                      {company.email}
                    </a>
                  </div>
                )}

              {/* WhatsApp */}
              {!companyLoading &&
                company?.whatsapp && (
                  <div className="pt-2">
                    <a
                      href={buildWhatsAppUrl(
                        company.whatsapp,
                        `Hi ${company.name}, I'd like to enquire about your services.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-8 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <p>
            © {new Date().getFullYear()}{" "}
            {company?.name || "JUSMO NETWORKS"}.
            {" "}All rights reserved.
          </p>

          <div className="flex justify-center gap-6 sm:justify-end">
            <Link
              to="/privacy"
              className="hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="hover:text-white"
            >
              Terms & Conditions
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
