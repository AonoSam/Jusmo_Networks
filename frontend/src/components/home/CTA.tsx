import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CTAProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonTo?: string;
}

function CTA({
  eyebrow = "Start Your Project",
  title = "Let's build the right technology solution for your needs.",
  description = "Tell us about your project and our team can help you determine the right technology and infrastructure approach.",
  buttonLabel = "Request a Quote",
  buttonTo = "/quote",
}: CTAProps) {
  return (
    <section className="bg-navy-950 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl border border-navy-800 bg-navy-900 px-8 py-16 sm:px-12 lg:px-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-500">
              {eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mt-5 text-lg leading-8 text-navy-300">
              {description}
            </p>
            <Link
              to={buttonTo}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 font-semibold text-navy-950 transition hover:bg-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
            >
              {buttonLabel}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;