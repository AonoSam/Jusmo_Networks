import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  submitEnquiry,
} from "../api/enquiries";

import type {
  EnquiryData,
} from "../api/enquiries";

import {
  getCompany,
} from "../api/company";

import type {
  Company,
} from "../api/company";


function Contact() {
  // ==========================================
  // COMPANY INFORMATION
  // ==========================================

  const [company, setCompany] =
    useState<Company | null>(null);


  // ==========================================
  // ENQUIRY FORM
  // ==========================================

  const [formData, setFormData] =
    useState<EnquiryData>({
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    });


  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD COMPANY INFORMATION
  // ==========================================

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const data = await getCompany();

        setCompany(data);
      } catch (error) {
        console.error(
          "Failed to load company information:",
          error
        );
      }
    };

    loadCompany();
  }, []);


  // ==========================================
  // HANDLE FORM INPUT
  // ==========================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };


  // ==========================================
  // SUBMIT ENQUIRY
  // ==========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await submitEnquiry(formData);

      setSuccess(
        "Your enquiry has been submitted successfully. Our team will get back to you soon."
      );

      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(
        "Failed to submit enquiry:",
        err
      );

      setError(
        "We could not submit your enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // WHATSAPP URL
  // ==========================================

  const whatsappUrl =
    company?.whatsapp
      ? `https://wa.me/${company.whatsapp.replace(
          /\D/g,
          ""
        )}`
      : null;


  return (
    <>
      {/* =================================
          HERO
      ================================== */}

      <section className="bg-slate-950 px-6 py-24 sm:py-32">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Contact Us
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let's talk about your next project
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Have a technology, networking or
              infrastructure requirement?
              Send us an enquiry and our team
              will get back to you.
            </p>

          </div>

        </div>

      </section>


      {/* =================================
          CONTACT + FORM
      ================================== */}

      <section className="bg-white px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-3">


            {/* =============================
                CONTACT INFORMATION
            ============================== */}

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Get In Touch
              </p>

              <h2 className="mt-4 text-3xl font-bold text-slate-950">
                We would love to hear from you
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                Tell us what you need and we'll
                help you find the right solution.
              </p>


              <div className="mt-10 space-y-6">


                {/* =============================
                    PHONE
                ============================== */}

                {company?.phone && (
                  <a
                    href={`tel:${company.phone}`}
                    className="flex gap-4"
                  >

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Phone size={19} />
                    </div>

                    <div>

                      <p className="text-sm text-slate-400">
                        Phone
                      </p>

                      <p className="mt-1 font-medium text-slate-900 transition hover:text-blue-600">
                        {company.phone}
                      </p>

                    </div>

                  </a>
                )}


                {/* =============================
                    WHATSAPP
                ============================== */}

                {company?.whatsapp && whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4"
                  >

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <MessageCircle size={19} />
                    </div>

                    <div>

                      <p className="text-sm text-slate-400">
                        WhatsApp
                      </p>

                      <p className="mt-1 font-medium text-slate-900 transition hover:text-blue-600">
                        {company.whatsapp}
                      </p>

                    </div>

                  </a>
                )}


                {/* =============================
                    EMAIL
                ============================== */}

                {company?.email && (
                  <a
                    href={`mailto:${company.email}`}
                    className="flex gap-4"
                  >

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Mail size={19} />
                    </div>

                    <div>

                      <p className="text-sm text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 break-all font-medium text-slate-900 transition hover:text-blue-600">
                        {company.email}
                      </p>

                    </div>

                  </a>
                )}


                {/* =============================
                    ADDRESS
                ============================== */}

                {company?.address && (
                  <div className="flex gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <MapPin size={19} />
                    </div>

                    <div>

                      <p className="text-sm text-slate-400">
                        Location
                      </p>

                      {company.google_maps_url ? (

                        <a
                          href={company.google_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block font-medium text-slate-900 transition hover:text-blue-600"
                        >
                          {company.address}
                        </a>

                      ) : (

                        <p className="mt-1 font-medium text-slate-900">
                          {company.address}
                        </p>

                      )}

                    </div>

                  </div>
                )}

              </div>

            </div>


            {/* =============================
                ENQUIRY FORM
            ============================== */}

            <div className="lg:col-span-2">

              <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"
              >

                <div className="grid gap-6 sm:grid-cols-2">


                  {/* =============================
                      NAME
                  ============================== */}

                  <div>

                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-slate-900"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>


                  {/* =============================
                      PHONE
                  ============================== */}

                  <div>

                    <label
                      htmlFor="phone"
                      className="text-sm font-semibold text-slate-900"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+254..."
                      className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>


                  {/* =============================
                      EMAIL
                  ============================== */}

                  <div>

                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-slate-900"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>


                  {/* =============================
                      SUBJECT
                  ============================== */}

                  <div>

                    <label
                      htmlFor="subject"
                      className="text-sm font-semibold text-slate-900"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>

                </div>


                {/* =============================
                    MESSAGE
                ============================== */}

                <div className="mt-6">

                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-slate-900"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={7}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your requirements..."
                    className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                {/* =============================
                    SUCCESS MESSAGE
                ============================== */}

                {success && (
                  <div
                    role="status"
                    className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                  >
                    {success}
                  </div>
                )}


                {/* =============================
                    ERROR MESSAGE
                ============================== */}

                {error && (
                  <div
                    role="alert"
                    className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}


                {/* =============================
                    SUBMIT
                ============================== */}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-7 inline-flex items-center justify-center rounded-lg bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Sending..."
                    : "Send Enquiry"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}


export default Contact;
