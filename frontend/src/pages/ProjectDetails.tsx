
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getProject,
  type Project,
} from "../api/projects";


function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>();

  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {
    const loadProject = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProject(slug);

        setProject(data);
      } catch (error) {
        console.error(
          "Failed to load project:",
          error
        );

        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);


  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">
          Loading project...
        </p>
      </div>
    );
  }


  /*
   * Project not found
   */
  if (!project) {
    return (
      <section className="px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">

          <h1 className="text-3xl font-bold text-slate-950">
            Project not found
          </h1>

          <p className="mt-4 text-slate-600">
            The project you are looking for could
            not be found.
          </p>

          <Link
            to="/projects"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Projects
          </Link>

        </div>
      </section>
    );
  }


  /*
   * Format project date
   */
  const formattedDate =
    project.project_date
      ? new Date(
          project.project_date
        ).toLocaleDateString(
          "en-KE",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )
      : null;


  return (
    <>
      {/* ================================
          HERO
      ================================= */}

      <section className="bg-slate-950 px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />

            Back to Projects
          </Link>


          <div className="mt-10 max-w-4xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              {project.category}
            </p>


            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>


            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              {project.description}
            </p>

          </div>

        </div>
      </section>



      {/* ================================
          MAIN PROJECT CONTENT
      ================================= */}

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-3">


            {/* ============================
                IMAGES
            ============================= */}

            <div className="lg:col-span-2">

              {/* Main image */}

              <div className="overflow-hidden rounded-2xl bg-slate-100">

                {project.images.length > 0 ? (

                  <img
                    src={project.images[0].image}
                    alt={
                      project.images[0].caption ||
                      project.title
                    }
                    className="h-auto max-h-[600px] w-full object-cover"
                  />

                ) : (

                  <div className="flex aspect-video items-center justify-center text-slate-400">
                    No project image available
                  </div>

                )}

              </div>



              {/* ============================
                  PROJECT GALLERY
              ============================= */}

              {project.images.length > 1 && (

                <div className="mt-8">

                  <h2 className="text-2xl font-bold text-slate-950">
                    Project Gallery
                  </h2>


                  <div className="mt-6 grid gap-5 sm:grid-cols-2">

                    {project.images
                      .slice(1)
                      .map((image) => (

                        <figure
                          key={image.id}
                          className="overflow-hidden rounded-2xl bg-slate-100"
                        >

                          <img
                            src={image.image}
                            alt={
                              image.caption ||
                              project.title
                            }
                            className="aspect-video w-full object-cover transition duration-300 hover:scale-[1.02]"
                          />


                          {image.caption && (

                            <figcaption className="p-4 text-sm text-slate-500">
                              {image.caption}
                            </figcaption>

                          )}

                        </figure>

                      ))}

                  </div>

                </div>

              )}

            </div>



            {/* ============================
                PROJECT INFORMATION
            ============================= */}

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <h2 className="text-xl font-bold text-slate-950">
                Project Information
              </h2>


              <div className="mt-7 space-y-6">


                {/* Category */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Category
                  </p>

                  <p className="mt-2 font-medium text-slate-900">
                    {project.category}
                  </p>

                </div>



                {/* Status */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </p>

                  <p className="mt-2 font-medium capitalize text-slate-900">
                    {project.status}
                  </p>

                </div>



                {/* Location */}

                {project.location && (

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Location
                    </p>


                    <div className="mt-2 flex items-center gap-2 text-slate-900">

                      <MapPin size={17} />

                      <span>
                        {project.location}
                      </span>

                    </div>

                  </div>

                )}



                {/* Project date */}

                {formattedDate && (

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Project Date
                    </p>


                    <div className="mt-2 flex items-center gap-2 text-slate-900">

                      <CalendarDays size={17} />

                      <span>
                        {formattedDate}
                      </span>

                    </div>

                  </div>

                )}



                {/* Client */}

                {project.client_name && (

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Client
                    </p>

                    <p className="mt-2 font-medium text-slate-900">
                      {project.client_name}
                    </p>

                  </div>

                )}

              </div>

            </aside>

          </div>



          {/* ================================
              SERVICES
          ================================= */}

          {project.services.length > 0 && (

            <div className="mt-16">

              <h2 className="text-2xl font-bold text-slate-950">
                Services Provided
              </h2>


              <div className="mt-6 flex flex-wrap gap-3">

                {project.services.map(
                  (service) => (

                    <span
                      key={service.id}
                      className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
                    >
                      {service.name}
                    </span>

                  )
                )}

              </div>

            </div>

          )}

        </div>
      </section>



      {/* ================================
          CTA
      ================================= */}

      <section className="px-6 pb-24">

        <div className="mx-auto max-w-7xl rounded-3xl bg-blue-600 px-8 py-14 text-center">

          <h2 className="text-3xl font-bold text-white">
            Have a similar project?
          </h2>


          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Talk to JUSMO NETWORKS about your
            technology, networking or
            infrastructure requirements.
          </p>


          <Link
            to="/quote"
            className="mt-8 inline-flex rounded-lg bg-white px-6 py-3.5 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Request a Quote
          </Link>

        </div>

      </section>
    </>
  );
}

export default ProjectDetails;
