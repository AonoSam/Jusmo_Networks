import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Introduction() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              About JUSMO NETWORKS
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Technology infrastructure that works for your business.
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-slate-600">
              JUSMO NETWORKS provides professional technology,
              networking, telecommunications, fibre optic,
              software, security surveillance and project
              management solutions.
            </p>

            <p className="mt-5 leading-7 text-slate-600">
              We focus on reliable implementation, quality
              installations and practical technology solutions
              designed around our clients' requirements.
            </p>

            <Link
              to="/about"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded"
            >
              Learn more about us
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Introduction;