
import {
  ArrowUpRight,
  MapPin,
} from "lucide-react";

import { Link } from "react-router-dom";
import type { Project } from "../../api/projects";

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">

        {project.images.length > 0 ? (
          <img
            src={project.images[0].image}
            alt={
              project.images[0].caption ||
              project.title
            }
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No project image
          </div>
        )}

        {/* Status */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold capitalize text-slate-700 shadow">
            {project.status}
          </span>
        </div>

      </div>

      {/* Content */}
      <div className="p-6">

        {/* Category */}
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          {project.category}
        </p>

        {/* Title */}
        <h2 className="mt-3 text-xl font-bold text-slate-950">
          {project.title}
        </h2>

        {/* Description */}
        <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
          {project.description}
        </p>

        {/* Location */}
        {project.location && (
          <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={16} />

            <span>
              {project.location}
            </span>
          </div>
        )}

        {/* View Project */}
        <Link
          to={`/projects/${project.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          View project
          <ArrowUpRight size={17} />
        </Link>

      </div>

    </article>
  );
}

export default ProjectCard;
