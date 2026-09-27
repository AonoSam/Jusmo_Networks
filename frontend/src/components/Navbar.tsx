import { Link, NavLink } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";

import ThemeToggle from "./ThemeToggle";
import { useCompany } from "../hooks/useCompany";

const navigation = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { company } = useCompany();

  return (
    <header className="sticky top-0 z-50 border-b border-navy-800 bg-navy-950/95 backdrop-blur-xl">
      {/* ========================= */}
      {/* MAIN NAVIGATION — full width, logo flush to screen edge */}
      {/* ========================= */}
      <nav className="flex min-h-36 w-full items-center justify-between pr-4 sm:pr-6 lg:pr-8">

        {/* ========================= */}
        {/* BRAND / LARGE LOGO — flush left, no padding */}
        {/* ========================= */}
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-4"
          aria-label="JUSMO NETWORKS home"
        >
          {/* LARGE COMPANY LOGO — 4cm x 3cm (~151px x 113px) */}
          {company?.logo ? (
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="h-[113px] w-[151px] shrink-0 object-contain"
            />
          ) : (
            <div className="flex h-[113px] w-[151px] shrink-0 items-center justify-center bg-navy-900 text-lg font-bold text-gold-500">
              JN
            </div>
          )}

          {/* ========================= */}
          {/* COMPANY NAME */}
          {/* ========================= */}
          <div className="leading-none">
            <div className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
              JUSMO
              <span className="text-gold-500"> NETWORKS</span>
            </div>

            <p className="mt-2 hidden text-[10px] font-medium uppercase tracking-[0.25em] text-navy-400 sm:block">
              Connecting You. Powering Possibilities.
            </p>
          </div>
        </Link>

        {/* ========================= */}
        {/* DESKTOP NAVIGATION */}
        {/* ========================= */}
        <div className="hidden items-center gap-7 md:flex lg:gap-8">

          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `relative py-2 text-sm font-medium transition duration-200 ${
                  isActive
                    ? "text-gold-500"
                    : "text-white hover:text-gold-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}

                  <span
                    className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-gold-500 transition-all duration-200 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}

          {/* Theme */}
          <ThemeToggle variant="dark" />

          {/* Request Quote */}
          <Link
            to="/quote"
            className="group inline-flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-sm transition duration-200 hover:bg-gold-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
          >
            Request a Quote

            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* ========================= */}
        {/* MOBILE MENU BUTTON */}
        {/* ========================= */}
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-navy-800 bg-navy-900 text-white transition hover:border-navy-600 hover:text-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={
            isOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* ========================= */}
      {/* MOBILE NAVIGATION */}
      {/* ========================= */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-navy-800 bg-navy-950 transition-all duration-300 md:hidden ${
          isOpen
            ? "max-h-[600px] opacity-100"
            : "max-h-0 border-t-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-6 pt-4 sm:px-6">

          <div className="flex flex-col">

            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `border-b border-navy-800 py-4 text-sm font-medium transition ${
                    isActive
                      ? "text-gold-500"
                      : "text-white hover:text-gold-500"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Mobile Theme Toggle */}
            <div className="mt-5 flex justify-center">
              <ThemeToggle variant="dark" />
            </div>

            {/* Mobile Quote */}
            <Link
              to="/quote"
              onClick={() => setIsOpen(false)}
              className="group mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-5 py-3.5 text-sm font-semibold text-navy-950 shadow-sm transition duration-200 hover:bg-gold-600 hover:shadow-md"
            >
              Request a Quote

              <ArrowUpRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;