import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import type { Company } from "../../api/company";
import { buildWhatsAppUrl } from "../../lib/whatsapp";

interface CompanyContactProps {
  company: Company;
}

function CompanyContact({ company }: CompanyContactProps) {
  return (
    <section className="bg-navy-950 border-t border-navy-800 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-navy-800 bg-navy-900 px-8 py-12 sm:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-500">
              Get In Touch
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Let's discuss your next project
            </h2>

            <p className="mt-5 leading-8 text-navy-300">
              Have a technology, networking or
              infrastructure requirement?
              Get in touch with our team.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {company.phone && (
              
               <a href={`tel:${company.phone}`}
                className="flex items-start gap-4 rounded-2xl border border-navy-800 bg-navy-950 p-5 transition hover:border-gold-500/40"
              >
                <Phone size={20} className="mt-1 text-gold-500" />
                <div>
                  <p className="text-sm text-navy-400">Phone</p>
                  <p className="mt-1 font-medium text-white">{company.phone}</p>
                </div>
              </a>
            )}

            {company.whatsapp && (
              
               <a href={buildWhatsAppUrl(
                  company.whatsapp,
                  `Hi ${company.name}, I'd like to enquire about your services.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-2xl border border-navy-800 bg-navy-950 p-5 transition hover:border-green-500/40"
              >
                <MessageCircle size={20} className="mt-1 text-green-500" />
                <div>
                  <p className="text-sm text-navy-400">WhatsApp</p>
                  <p className="mt-1 font-medium text-white">{company.whatsapp}</p>
                </div>
              </a>
            )}

            {company.email && (
              
               <a href={`mailto:${company.email}`}
                className="flex items-start gap-4 rounded-2xl border border-navy-800 bg-navy-950 p-5 transition hover:border-gold-500/40"
              >
                <Mail size={20} className="mt-1 text-gold-500" />
                <div>
                  <p className="text-sm text-navy-400">Email</p>
                  <p className="mt-1 break-all font-medium text-white">{company.email}</p>
                </div>
              </a>
            )}

            {company.address && (
              
               <a href={company.google_maps_url || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-2xl border border-navy-800 bg-navy-950 p-5 transition hover:border-gold-500/40"
              >
                <MapPin size={20} className="mt-1 text-gold-500" />
                <div>
                  <p className="text-sm text-navy-400">Location</p>
                  <p className="mt-1 font-medium text-white">{company.address}</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CompanyContact;