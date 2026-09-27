import type { Company } from "../../api/company";

interface MissionVisionProps {
  company: Company;
}

function MissionVision({ company }: MissionVisionProps) {
  const sections = [
    {
      title: "Our Mission",
      content: company.mission,
      number: "01",
    },
    {
      title: "Our Vision",
      content: company.vision,
      number: "02",
    },
    {
      title: "Our Values",
      content: company.values,
      number: "03",
    },
  ].filter((section) => section.content.trim());

  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            What Drives Us
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Purpose, Direction & Values
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Our commitment is guided by a clear mission, a strong vision,
            and values that shape everything we do.
          </p>
        </div>

        {/* Cards */}
        <div className="grid items-start gap-6 lg:grid-cols-12">

          {sections.map((section) => {
            const isValues = section.title === "Our Values";

            return (
              <article
                key={section.title}
                className={`group relative self-start overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  isValues
                    ? "lg:col-span-6"
                    : "lg:col-span-3"
                }`}
              >
                {/* Top Accent */}
                <div className="absolute left-0 top-0 h-1 w-14 bg-amber-500 transition-all duration-300 group-hover:w-24" />

                {/* Number */}
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm font-bold tracking-widest text-slate-300">
                    {section.number}
                  </span>

                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-slate-950">
                  {section.title}
                </h2>

                {/* Content */}
                <p
                  className={`mt-4 whitespace-pre-line text-slate-600 ${
                    isValues
                      ? "leading-7"
                      : "text-sm leading-6"
                  }`}
                >
                  {section.content}
                </p>
              </article>
            );
          })}

        </div>
      </div>
    </section>
  );
}

export default MissionVision;