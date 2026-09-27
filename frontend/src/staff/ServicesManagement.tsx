import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import {
  getServices,
  createService,
  updateService,
  deleteService,
  type Service,
  type ServiceInput,
} from "../api/services";

const emptyForm: ServiceInput = {
  name: "",
  short_description: "",
  description: "",
  icon: "",
  is_active: true,
  display_order: 0,
};

function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreateModal = () => {
    setEditingSlug(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingSlug(service.slug);
    setForm({
      name: service.name,
      short_description: service.short_description,
      description: service.description,
      icon: service.icon,
      is_active: service.is_active,
      display_order: service.display_order,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      if (editingSlug) {
        await updateService(editingSlug, form);
      } else {
        await createService(form);
      }
      setModalOpen(false);
      await loadServices();
    } catch (error: any) {
      const data = error?.response?.data;
      const firstError = data
        ? Object.values(data).flat()[0]
        : "Failed to save service.";
      setFormError(String(firstError));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service: Service) => {
    if (!window.confirm(`Delete "${service.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteService(service.slug);
      await loadServices();
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("Failed to delete service.");
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      await updateService(service.slug, { is_active: !service.is_active });
      await loadServices();
    } catch (error) {
      console.error("Failed to toggle service:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="mt-1 text-sm text-navy-400">
            Manage the services shown on your website.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-600"
        >
          <Plus size={17} />
          Add Service
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-navy-800 bg-navy-950">
        <div className="overflow-x-auto">
         {loading ? (
          <p className="p-6 text-navy-400">Loading services...</p>
         ) : services.length === 0 ? (
          <p className="p-6 text-navy-400">No services yet.</p>
         ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-navy-800 text-left text-navy-400">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Order</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-navy-900 last:border-0">
                  <td className="px-6 py-4 text-white">{service.name}</td>
                  <td className="px-6 py-4 text-navy-300">{service.display_order}</td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => toggleActive(service)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        service.is_active
                          ? "bg-green-950 text-green-400"
                          : "bg-navy-900 text-navy-400"
                      }`}
                    >
                      {service.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(service)}
                        className="text-navy-300 transition hover:text-gold-500"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(service)}
                        className="text-navy-300 transition hover:text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-lg rounded-2xl border border-navy-800 bg-navy-950 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingSlug ? "Edit Service" : "Add Service"}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-navy-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {formError && (
                <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-2 text-sm text-red-400">
                  {formError}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-navy-200">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-navy-200">Short Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Short Description"
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-navy-200">Full Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Full Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-navy-200">Icon</label>
                  <input
                    type="text"
                    placeholder="Icon"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-navy-200">Display Order</label>
                  <input
                    type="number"
                    placeholder="Display Order"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                    className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-600"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-navy-200">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-navy-700 bg-navy-900 accent-gold-500"
                />
                Active
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-navy-700 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesManagement;