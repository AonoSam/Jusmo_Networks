import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Service } from "../../api/services";
import ServiceIcon from "./ServiceIcon";

interface ServiceCardProps {
  service: Service;
}

function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-navy-800 bg-navy-900 p-7 transition duration-300 hover:-translate-y-1 hover:border-gold-500/40">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-800 text-gold-500">
        <ServiceIcon name={service.name} icon={service.icon} />
      </div>

      <h2 className="mt-6 line-clamp-2 break-words text-xl font-bold text-white">
        {service.name}
      </h2>
      <p className="mt-3 line-clamp-4 break-words leading-7 text-navy-300">
        {service.short_description}
      </p>

      <Link
        to={`/services/${service.slug}`}
        className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-semibold text-gold-500 transition hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 rounded"
      >
        Learn more
        <ArrowUpRight size={17} />
      </Link>
    </article>
  );
}

export default ServiceCard;