import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";

import {
  getTestimonials,
  type Testimonial,
} from "../api/testimonials";

function Testimonials() {
  const [testimonials, setTestimonials] = useState<
    Testimonial[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getTestimonials();

        setTestimonials(data);
      } catch (err) {
        console.error(
          "Failed to load testimonials:",
          err
        );

        setError(
          "Unable to load testimonials at the moment."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  return (
    <section
      id="testimonials"
      className="bg-slate-50 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Testimonials
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            What Our Clients Say
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            We are committed to delivering reliable technology,
            networking, and infrastructure solutions that create
            real value for our clients.
          </p>

        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-16 flex justify-center">
            <p className="text-slate-500">
              Loading testimonials...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-16 text-center">
            <p className="text-sm text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          testimonials.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-slate-500">
                No testimonials available yet.
              </p>
            </div>
          )}

        {/* Testimonials */}
        {!loading &&
          !error &&
          testimonials.length > 0 && (
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.id}
                  className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* Quote Icon */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Quote size={20} />
                  </div>

                  {/* Rating */}
                  <div className="mt-6 flex items-center gap-1">
                    {Array.from({
                      length: 5,
                    }).map((_, index) => (
                      <Star
                        key={index}
                        size={17}
                        className={
                          index <
                          testimonial.rating
                            ? "fill-current text-yellow-400"
                            : "text-slate-300"
                        }
                      />
                    ))}
                  </div>

                  {/* Testimonial Content */}
                  <blockquote className="mt-6 flex-1 text-base leading-7 text-slate-600">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Client */}
                  <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">

                    {/* Image */}
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {testimonial.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950">
                        {testimonial.name}
                      </p>

                      {testimonial.role && (
                        <p className="truncate text-sm text-slate-500">
                          {testimonial.role}
                        </p>
                      )}

                      {testimonial.company_name && (
                        <p className="truncate text-sm text-blue-600">
                          {testimonial.company_name}
                        </p>
                      )}
                    </div>

                  </div>
                </article>
              ))}

            </div>
          )}

      </div>
    </section>
  );
}

export default Testimonials;
