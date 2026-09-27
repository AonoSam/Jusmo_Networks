import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";

import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  updateTestimonialImage,
  type Testimonial,
  type TestimonialInput,
} from "../api/testimonials";

const emptyForm: TestimonialInput = {
  name: "",
  company_name: "",
  role: "",
  content: "",
  rating: 5,
  is_published: true,
  display_order: 0,
};

function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TestimonialInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const loadTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Failed to load testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setForm({
      name: testimonial.name,
      company_name: testimonial.company_name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      is_published: testimonial.is_published,
      display_order: testimonial.display_order,
    });
    setImageFile(null);
    setImagePreview(testimonial.image);
    setFormError(null);
    setModalOpen(true);
  };

  const handleImageSelect = (file: File | null) => {
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      let saved: Testimonial;

      if (editingId) {
        saved = await updateTestimonial(editingId, form);
      } else {
        saved = await createTestimonial(form);
      }

      if (imageFile) {
        await updateTestimonialImage(saved.id, imageFile);
      }

      setModalOpen(false);
      await loadTestimonials();
    } catch (error: any) {
      const data = error?.response?.data;
      const firstError = data ? Object.values(data).flat()[0] : "Failed to save testimonial.";
      setFormError(String(firstError));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (!window.confirm(`Delete testimonial from "${testimonial.name}"?`)) return;

    try {
      await deleteTestimonial(testimonial.id);
      await loadTestimonials();
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
      alert("Failed to delete testimonial.");
    }
  };

  const togglePublished = async (testimonial: Testimonial) => {
    try {
      await updateTestimonial(testimonial.id, { is_published: !testimonial.is_published });
      await loadTestimonials();
    } catch (error) {
      console.error("Failed to toggle testimonial:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="mt-1 text-sm text-navy-400">
            Manage client testimonials shown on your Home page.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-600"
        >
          <Plus size={17} />
          Add Testimonial
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-navy-800 bg-navy-950">
        <div className="overflow-x-auto">
         {loading ? (
          <p className="p-6 text-navy-400">Loading testimonials...</p>
         ) : testimonials.length === 0 ? (
          <p className="p-6 text-navy-400">No testimonials yet.</p>
         ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-navy-800 text-left text-navy-400">
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Company</th>
                <th className="px-6 py-3 font-medium">Rating</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id} className="border-b border-navy-900 last:border-0">
                  <td className="px-6 py-4 text-white">{testimonial.name}</td>
                  <td className="px-6 py-4 text-navy-300">{testimonial.company_name || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i < testimonial.rating ? "fill-current text-gold-500" : "text-navy-700"}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => togglePublished(testimonial)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        testimonial.is_published ? "bg-green-950 text-green-400" : "bg-navy-900 text-navy-400"
                      }`}
                    >
                      {testimonial.is_published ? "Published" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => openEditModal(testimonial)} className="text-navy-300 transition hover:text-gold-500" aria-label="Edit">
                        <Pencil size={16} />
                      </button>
                      <button type="button" onClick={() => handleDelete(testimonial)} className="text-navy-300 transition hover:text-red-400" aria-label="Delete">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 py-10 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-navy-800 bg-navy-950 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Edit Testimonial" : "Add Testimonial"}
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

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-navy-900">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-navy-500">No photo</span>
                  )}
                </div>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-navy-700 px-3 py-2 text-xs font-medium text-navy-200 transition hover:bg-navy-900">
                  Choose photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e.target.files?.[0] || null)} />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="text-sm font-medium text-navy-200">Role</label>
                  <input
                    type="text"
                    placeholder="Role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-navy-200">Company</label>
                <input
                  type="text"
                  placeholder="Company"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-navy-200">Testimonial</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Testimonial"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-navy-200">Rating</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Star{n !== 1 ? "s" : ""}</option>
                    ))}
                  </select>
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
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="h-4 w-4 rounded border-navy-700 bg-navy-900 accent-gold-500"
                />
                Published
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-navy-700 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-900">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600 disabled:opacity-60">
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

export default TestimonialsManagement;