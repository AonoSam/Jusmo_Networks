import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-navy-950 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hero-bg.png')" }}
    >
      {/* Overlay: darkens the photo so white text stays legible everywhere,
          strongest on the left where the heading sits, lighter on the right
          so the skyline detail still shows through */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" />
      {/* Extra bottom fade so the section blends cleanly into the next one */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 pt-6 pb-12 sm:pt-8 sm:pb-14 lg:pt-10 lg:pb-16">
        <div className="max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-gold-500">
            JUSMO NETWORKS
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
            Connecting You. Powering Possibilities
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-navy-100">
            JUSMO NETWORKS is a technology and telecommunications solutions company,
            providing professional services in Network Design, Telecommunication
            Consultancy, Fibre Optics, System Development, CCTV & Security
            Surveillance Systems, and Project Management.
          </p>

          <p className="mt-3 max-w-2xl leading-7 text-navy-100">
            We deliver reliable, innovative, and practical solutions designed to
            meet the unique needs of our clients. From planning and deploying
            network infrastructure to developing technology systems, implementing
            security solutions, and managing technical projects, we are committed
            to quality workmanship, reliability, and professional service delivery.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 font-semibold text-navy-950 transition hover:bg-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
            >
              Request a Quote
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:border-gold-500 hover:text-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
            >
              Explore Our Services
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm text-navy-200">
            <MessageCircle size={18} className="text-gold-500" />
            <span>Technology solutions built around your needs.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;