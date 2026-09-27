import { ArrowRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getProjects,
  type Project,
} from "../../api/projects";

function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to load projects:", error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <section className="bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Our Work
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Featured Projects
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Explore some of the technology and infrastructure
              projects delivered by JUSMO NETWORKS.
            </p>
          </div>

          {!loading && !hasError && projects.length > 0 && (
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded"
            >
              View all projects
              <ArrowRight size={18} />
            </Link>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-12 text-slate-500">
            Loading projects...
          </div>
        )}

        {/* Error */}
        {!loading && hasError && (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              Projects couldn't be loaded
            </h3>
            <p className="mt-2 text-slate-500">
              Something went wrong on our end — please refresh the page.
            </p>
          </div>
        )}

        {/* Projects */}
        {!loading && !hasError && projects.length > 0 && (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0].image}
                      alt={project.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      Project Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                    {project.category}
                  </div>

                  <h3 className="mt-3 text-xl font-bold text-slate-950">
                    {project.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
                    {project.description}
                  </p>

                  {project.location && (
                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={16} />

                      <span>{project.location}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !hasError && projects.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              Projects coming soon
            </h3>

            <p className="mt-2 text-slate-500">
              Our featured projects will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProjects;