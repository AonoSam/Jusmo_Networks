import { useEffect, useMemo, useState } from "react";

import {
  getProjects,
  type Project,
} from "../api/projects";

import ProjectsHero from "../components/projects/ProjectsHero";
import ProjectFilters from "../components/projects/ProjectFilters";
import ProjectGrid from "../components/projects/ProjectGrid";

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();

        setProjects(data);
      } catch (error) {
        console.error(
          "Failed to load projects:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        projects
          .map((project) => project.category)
          .filter(Boolean)
      )
    );

    return ["All", ...uniqueCategories];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") {
      return projects;
    }

    return projects.filter(
      (project) =>
        project.category === activeCategory
    );
  }, [projects, activeCategory]);

  return (
    <>
      <ProjectsHero />

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {/* Filters */}
          <div className="mb-10">
            <ProjectFilters
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              Loading projects...
            </div>
          ) : (
            <ProjectGrid
              projects={filteredProjects}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default Projects;