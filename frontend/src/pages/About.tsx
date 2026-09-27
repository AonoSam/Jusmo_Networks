import {
  useEffect,
  useState,
} from "react";

import {
  getCompany,
  type Company,
} from "../api/company";

import AboutHero from "../components/about/AboutHero";
import CompanyOverview from "../components/about/CompanyOverview";
import MissionVision from "../components/about/MissionVision";
type CompanyContactProps = {
  company: Company;
};

const CompanyContact = (_props: CompanyContactProps) => null;

function About() {
  const [company, setCompany] =
    useState<Company | null>(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {
    const loadCompany = async () => {
      try {
        const data =
          await getCompany();

        setCompany(data);
      } catch (error) {
        console.error(
          "Failed to load company information:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, []);


  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">
          Loading company information...
        </p>
      </div>
    );
  }


  if (!company) {
    return (
      <section className="px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">

          <h1 className="text-3xl font-bold text-slate-950">
            Company information unavailable
          </h1>

          <p className="mt-4 text-slate-600">
            We could not load the company
            information at this time.
          </p>

        </div>
      </section>
    );
  }


  return (
    <>
      <AboutHero company={company} />

      <CompanyOverview
        company={company}
      />

      <MissionVision
        company={company}
      />

      <CompanyContact
        company={company}
      />
    </>
  );
}


export default About;
