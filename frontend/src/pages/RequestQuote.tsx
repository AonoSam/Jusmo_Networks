import {
  ArrowLeft,
  Calendar,
  CheckCircle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  submitQuotation,
} from "../api/quotations";

import type {
  QuotationData,
} from "../api/quotations";

import {
  getServices,
} from "../api/services";

import type {
  Service,
} from "../api/services";


function RequestQuote() {

  // ==========================================
  // SERVICES
  // ==========================================

  const [services, setServices] =
    useState<Service[]>([]);

  const [servicesLoading, setServicesLoading] =
    useState(true);


  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] =
    useState<QuotationData>({
      client_name: "",
      company_name: "",
      phone: "",
      email: "",
      location: "",
      service: 0,
      project_description: "",
      preferred_project_date: null,
      budget_range: "",
      additional_comments: "",
    });


  // ==========================================
  // SUBMISSION STATE
  // ==========================================

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD SERVICES
  // ==========================================

  useEffect(() => {

    const loadServices = async () => {

      try {

        const data =
          await getServices();

        setServices(
          data.filter(
            (service) =>
              service.is_active
          )
        );

      } catch (error) {

        console.error(
          "Failed to load services:",
          error
        );

        setError(
          "We could not load our services. Please refresh the page and try again."
        );

      } finally {

        setServicesLoading(false);

      }

    };

    loadServices();

  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData((current) => ({
      ...current,

      [name]:
        name === "service"
          ? Number(value)
          : value,
    }));

  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setLoading(true);
    setSuccess(false);
    setError("");


    if (!formData.service) {

      setError(
        "Please select a service."
      );

      setLoading(false);

      return;
    }


    try {

      await submitQuotation(
        formData
      );

      setSuccess(true);


      setFormData({
        client_name: "",
        company_name: "",
        phone: "",
        email: "",
        location: "",
        service: 0,
        project_description: "",
        preferred_project_date: null,
        budget_range: "",
        additional_comments: "",
      });

    } catch (error) {

      console.error(
        "Failed to submit quotation:",
        error
      );

      setError(
        "We could not submit your quotation request. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // SUCCESS SCREEN
  // ==========================================

  if (success) {

    return (
      <section className="px-6 py-32">

        <div className="mx-auto max-w-2xl text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">

            <CheckCircle
              size={34}
            />

          </div>


          <h1 className="mt-7 text-3xl font-bold text-slate-950 sm:text-4xl">

            Quote request received

          </h1>


          <p className="mt-5 leading-8 text-slate-600">

            Thank you for contacting JUSMO
            NETWORKS. We have received your
            quotation request and our team will
            review your requirements and get
            back to you.

          </p>


          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              to="/"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Home
            </Link>


            <Link
              to="/projects"
              className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Our Projects
            </Link>

          </div>

        </div>

      </section>
    );

  }


  // ==========================================
  // FORM
  // ==========================================

  return (
    <>
      {/* ======================================
          HERO
      ======================================= */}

      <section className="bg-slate-950 px-6 py-20 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >

            <ArrowLeft
              size={17}
            />

            Back to Home

          </Link>


          <div className="mt-10 max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">

              Request a Quote

            </p>


            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">

              Tell us about your project

            </h1>


            <p className="mt-6 text-lg leading-8 text-slate-300">

              Share your requirements with us and
              our team will review your project and
              prepare the right solution for you.

            </p>

          </div>

        </div>

      </section>


      {/* ======================================
          FORM
      ======================================= */}

      <section className="bg-slate-50 px-6 py-20">

        <div className="mx-auto max-w-4xl">

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10"
          >

            {/* =================================
                CLIENT INFORMATION
            ================================== */}

            <div>

              <h2 className="text-2xl font-bold text-slate-950">
                Your Information
              </h2>

              <p className="mt-2 text-slate-500">
                Tell us how we can reach you.
              </p>

            </div>


            <div className="mt-8 grid gap-6 sm:grid-cols-2">


              {/* Client Name */}

              <div>

                <label
                  htmlFor="client_name"
                  className="text-sm font-semibold text-slate-900"
                >
                  Full Name *
                </label>

                <input
                  id="client_name"
                  name="client_name"
                  type="text"
                  required
                  value={
                    formData.client_name
                  }
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Company */}

              <div>

                <label
                  htmlFor="company_name"
                  className="text-sm font-semibold text-slate-900"
                >
                  Company Name
                </label>

                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  value={
                    formData.company_name
                  }
                  onChange={handleChange}
                  placeholder="Your company name"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Phone */}

              <div>

                <label
                  htmlFor="phone"
                  className="text-sm font-semibold text-slate-900"
                >
                  Phone Number *
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={
                    formData.phone
                  }
                  onChange={handleChange}
                  placeholder="+254..."
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-900"
                >
                  Email Address *
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={
                    formData.email
                  }
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Location */}

              <div className="sm:col-span-2">

                <label
                  htmlFor="location"
                  className="text-sm font-semibold text-slate-900"
                >
                  Project Location *
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={
                    formData.location
                  }
                  onChange={handleChange}
                  placeholder="e.g. Nairobi, Kenya"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>


            {/* =================================
                PROJECT DETAILS
            ================================== */}

            <div className="mt-12 border-t border-slate-200 pt-10">

              <h2 className="text-2xl font-bold text-slate-950">
                Project Details
              </h2>

              <p className="mt-2 text-slate-500">
                Tell us what you need.
              </p>


              <div className="mt-8 space-y-6">


                {/* Service */}

                <div>

                  <label
                    htmlFor="service"
                    className="text-sm font-semibold text-slate-900"
                  >
                    Service Required *
                  </label>

                  <select
                    id="service"
                    name="service"
                    required
                    value={
                      formData.service
                    }
                    onChange={handleChange}
                    disabled={
                      servicesLoading
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                  >

                    <option value={0}>
                      {servicesLoading
                        ? "Loading services..."
                        : "Select a service"}
                    </option>


                    {services.map(
                      (service) => (
                        <option
                          key={
                            service.id
                          }
                          value={
                            service.id
                          }
                        >
                          {service.name}
                        </option>
                      )
                    )}

                  </select>

                </div>


                {/* Project Description */}

                <div>

                  <label
                    htmlFor="project_description"
                    className="text-sm font-semibold text-slate-900"
                  >
                    Project Description *
                  </label>

                  <textarea
                    id="project_description"
                    name="project_description"
                    required
                    rows={7}
                    value={
                      formData.project_description
                    }
                    onChange={handleChange}
                    placeholder="Describe your project, requirements, expected outcome, number of users/devices, site size, or any other useful information..."
                    className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                <div className="grid gap-6 sm:grid-cols-2">


                  {/* Preferred Date */}

                  <div>

                    <label
                      htmlFor="preferred_project_date"
                      className="text-sm font-semibold text-slate-900"
                    >
                      Preferred Project Date
                    </label>

                    <div className="relative">

                      <Calendar
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="preferred_project_date"
                        name="preferred_project_date"
                        type="date"
                        value={
                          formData.preferred_project_date ??
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        className="mt-2 w-full rounded-lg border border-slate-300 px-11 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                  </div>


                  {/* Budget */}

                  <div>

                    <label
                      htmlFor="budget_range"
                      className="text-sm font-semibold text-slate-900"
                    >
                      Budget Range
                    </label>

                    <select
                      id="budget_range"
                      name="budget_range"
                      value={
                        formData.budget_range
                      }
                      onChange={
                        handleChange
                      }
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >

                      <option value="">
                        Select budget range
                      </option>

                      <option value="Below KES 50,000">
                        Below KES 50,000
                      </option>

                      <option value="KES 50,000 - 100,000">
                        KES 50,000 - 100,000
                      </option>

                      <option value="KES 100,000 - 250,000">
                        KES 100,000 - 250,000
                      </option>

                      <option value="KES 250,000 - 500,000">
                        KES 250,000 - 500,000
                      </option>

                      <option value="Above KES 500,000">
                        Above KES 500,000
                      </option>

                      <option value="Not sure">
                        Not sure
                      </option>

                    </select>

                  </div>

                </div>


                {/* Additional Comments */}

                <div>

                  <label
                    htmlFor="additional_comments"
                    className="text-sm font-semibold text-slate-900"
                  >
                    Additional Comments
                  </label>

                  <textarea
                    id="additional_comments"
                    name="additional_comments"
                    rows={5}
                    value={
                      formData.additional_comments
                    }
                    onChange={handleChange}
                    placeholder="Anything else you'd like us to know?"
                    className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

            </div>


            {/* =================================
                ERROR
            ================================== */}

            {error && (

              <div
                role="alert"
                className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>

            )}


            {/* =================================
                SUBMIT
            ================================== */}

            <div className="mt-8 border-t border-slate-200 pt-8">

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >

                {loading
                  ? "Submitting Request..."
                  : "Request a Quote"}

              </button>


              <p className="mt-4 text-sm leading-6 text-slate-500">
                By submitting this form, you are
                requesting a quotation from JUSMO
                NETWORKS. Our team will review your
                requirements and contact you.
              </p>

            </div>

          </form>

        </div>

      </section>
    </>
  );
}


export default RequestQuote;
