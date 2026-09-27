import { useEffect, useState, type FormEvent } from "react";
import { Save, Upload } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import {
  getCompany,
  updateCompanyDetails,
  updateCompanyLogo,
  type Company,
  type CompanyTextFields,
} from "../api/company";

type FieldKey = keyof CompanyTextFields;

const fieldGroups: { title: string; fields: FieldKey[] }[] = [
  { title: "Basic Info", fields: ["name", "tagline", "description"] },
  { title: "Mission & Values", fields: ["mission", "vision", "values"] },
  { title: "Contact", fields: ["phone", "whatsapp", "email"] },
  { title: "Location", fields: ["address", "google_maps_url"] },
  { title: "Social Links", fields: ["facebook_url", "linkedin_url", "instagram_url"] },
];

const textareaFields: FieldKey[] = ["description", "mission", "vision", "values", "address"];

const placeholders: Partial<Record<FieldKey, string>> = {
  name: "e.g. JUSMO NETWORKS",
  tagline: "e.g. Connecting You. Powering Possibilities.",
  description: "A short paragraph describing what your company does...",
  mission: "Your company's mission statement...",
  vision: "Your company's vision statement...",
  values: "Core values, one per line or as a short paragraph...",
  phone: "e.g. +254710123456",
  whatsapp: "e.g. +254710123456",
  email: "e.g. info@jusmonetworks.co.ke",
  address: "e.g. Nairobi, Kenya",
  google_maps_url: "https://maps.google.com/...",
  facebook_url: "https://facebook.com/yourpage",
  linkedin_url: "https://linkedin.com/company/yourcompany",
  instagram_url: "https://instagram.com/yourhandle",
};

function CompanyManagement() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const [company, setCompany] = useState<Company | null>(null);
  const [form, setForm] = useState<Partial<CompanyTextFields>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoSaving, setLogoSaving] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCompany();
        setCompany(data);
        setForm(data);
      } catch (error) {
        console.error("Failed to load company:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (field: FieldKey, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!company) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const updated = await updateCompanyDetails(company.id, form);
      setCompany(updated);
      setSaveSuccess(true);
    } catch (error: any) {
      setSaveError(
        error?.response?.data?.detail || "Failed to save changes."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogoSelect = (file: File | null) => {
    setLogoFile(file);
    setLogoError(null);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(null);
    }
  };

  const handleLogoUpload = async () => {
    if (!company || !logoFile) return;

    setLogoSaving(true);
    setLogoError(null);

    try {
      const updated = await updateCompanyLogo(company.id, logoFile);
      setCompany(updated);
      setLogoFile(null);
      setLogoPreview(null);
    } catch (error: any) {
      setLogoError(
        error?.response?.data?.detail || "Failed to update logo."
      );
    } finally {
      setLogoSaving(false);
    }
  };

  if (loading) {
    return <p className="text-navy-300">Loading company information...</p>;
  }

  if (!company) {
    return <p className="text-navy-300">No company record found.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Company</h1>
      <p className="mt-1 text-sm text-navy-300">
        Manage your public-facing company information.
      </p>

      <div className="mt-8 rounded-2xl border border-navy-800 bg-navy-950 p-6">
        <h2 className="text-lg font-bold text-white">Company Logo</h2>

        <div className="mt-4 flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-navy-900">
            {logoPreview ? (
              <img src={logoPreview} alt="New logo preview" className="max-h-20 max-w-20 object-contain" />
            ) : company.logo ? (
              <img src={company.logo} alt={company.name} className="max-h-20 max-w-20 object-contain" />
            ) : (
              <span className="text-xs text-navy-400">No logo</span>
            )}
          </div>

          {isSuperAdmin ? (
            <div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-950 shadow-sm transition hover:bg-gold-600">
                <Upload size={16} />
                Choose New Logo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogoSelect(e.target.files?.[0] || null)}
                />
              </label>

              {logoFile && (
                <button
                  type="button"
                  onClick={handleLogoUpload}
                  disabled={logoSaving}
                  className="ml-3 rounded-lg border border-gold-500 px-4 py-2.5 text-sm font-semibold text-gold-500 transition hover:bg-gold-500 hover:text-navy-950 disabled:opacity-60"
                >
                  {logoSaving ? "Uploading..." : "Save Logo"}
                </button>
              )}

              {logoError && <p className="mt-2 text-sm text-red-400">{logoError}</p>}
            </div>
          ) : (
            <p className="text-sm text-navy-400">
              Only a Super Admin can change the company logo.
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {fieldGroups.map((group) => (
          <div key={group.title} className="rounded-2xl border border-navy-800 bg-navy-950 p-6">
            <h2 className="text-lg font-bold text-white">{group.title}</h2>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {group.fields.map((field) => (
                <div
                  key={field}
                  className={textareaFields.includes(field) ? "sm:col-span-2" : ""}
                >
                  <label className="text-sm font-semibold text-gold-500 capitalize">
                    {field.replace(/_/g, " ")}
                  </label>

                  {textareaFields.includes(field) ? (
                    <textarea
                      rows={3}
                      placeholder={placeholders[field]}
                      value={form[field] || ""}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="mt-2 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-500"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={placeholders[field]}
                      value={form[field] || ""}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="mt-2 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {saveError && (
          <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
            {saveError}
          </div>
        )}

        {saveSuccess && (
          <div className="rounded-lg border border-green-800 bg-green-950/50 px-4 py-3 text-sm text-green-400">
            Company information updated successfully.
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-gold-600 disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default CompanyManagement;