import type { Company } from "../../api/company";

interface AboutHeroProps {
  company: Company;
}

function AboutHero({ company }: AboutHeroProps) {
  return (
    <section className="bg-navy-950 px-6 pt-8 pb-12 sm:pt-12 sm:pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-500">
            About Us
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {company.name}
          </h1>

          {company.tagline && (
            <p className="mt-6 text-xl leading-8 text-navy-300 sm:text-2xl">
              {company.tagline}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default AboutHero;