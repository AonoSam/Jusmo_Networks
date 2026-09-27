import {
  CheckCircle2,
  Headphones,
  Lightbulb,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

const reasons = [
  { title: "Professional Technical Expertise", description: "Technical knowledge and practical solutions for complex infrastructure requirements.", icon: Lightbulb },
  { title: "Reliable Service Delivery", description: "A structured approach focused on dependable implementation and delivery.", icon: CheckCircle2 },
  { title: "Quality Installations", description: "Careful installation practices designed for reliable long-term performance.", icon: Wrench },
  { title: "Modern Technology", description: "Solutions built around current technologies and evolving business needs.", icon: Lightbulb },
  { title: "Customer-Focused Solutions", description: "We design solutions around the specific requirements of every client.", icon: Users },
  { title: "Experienced Technical Support", description: "Technical support to help keep systems and infrastructure operating effectively.", icon: Headphones },
];

function WhyChooseUs() {
  return (
    <section className="bg-navy-950 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-500">
            Why JUSMO
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built around reliability, quality and expertise.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <div key={reason.title} className="rounded-2xl border border-navy-800 bg-navy-900 p-7 transition hover:border-gold-500/40">
              <reason.icon className="text-gold-500" size={28} />
              <h3 className="mt-5 text-lg font-bold text-white">{reason.title}</h3>
              <p className="mt-3 leading-7 text-navy-300">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;