import type { Company } from "../../api/company";

interface CompanyOverviewProps {
  company: Company;
}

function CompanyOverview({ company }: CompanyOverviewProps) {
  return (
    <section className="bg-navy-950 px-6 pt-4 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-500">
              Who We Are
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Technology solutions built around your business
            </h2>

            <p className="mt-6 whitespace-pre-line text-lg leading-8 text-navy-300">
              {company.description}
            </p>
          </div>

          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-navy-800 bg-navy-900 p-10">
            {company.logo ? (
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="max-h-48 max-w-full object-contain"
              />
            ) : (
              <div className="text-center">
                <div className="text-4xl font-bold text-navy-700">{company.name}</div>
                <p className="mt-3 text-sm text-navy-500">Our company</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CompanyOverview;