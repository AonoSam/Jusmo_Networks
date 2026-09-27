import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X, Images } from "lucide-react";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  type Project,
  type ProjectInput,
} from "../api/projects";
import { getServices, type Service } from "../api/services";
import ProjectImagesModal from "./ProjectImagesModal";

const emptyForm: ProjectInput = {
  title: "",
  description: "",
  category: "",
  location: "",
  client_name: "",
  services: [],
  project_date: null,
  status: "completed",
  featured: false,
  is_published: true,
};

function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [imagesProject, setImagesProject] = useState<Project | null>(null);

  const loadData = async () => {
    try {
      const [projectsData, servicesData] = await Promise.all([
        getProjects(),
        getServices(),
      ]);
      setProjects(projectsData);
      setServices(servicesData);

      setImagesProject((current) => {
        if (!current) return current;
        const updated = projectsData.find((p) => p.slug === current.slug);
        return updated || null;
      });
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingSlug(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingSlug(project.slug);
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      location: project.location,
      client_name: project.client_name,
      services: project.services.map((s) => s.id),
      project_date: project.project_date,
      status: project.status,
      featured: project.featured,
      is_published: project.is_published,
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
        await updateProject(editingSlug, form);
      } else {
        await createProject(form);
      }
      setModalOpen(false);
      await loadData();
    } catch (error: any) {
      const data = error?.response?.data;
      const firstError = data ? Object.values(data).flat()[0] : "Failed to save project.";
      setFormError(String(firstError));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

    try {
      await deleteProject(project.slug);
      await loadData();
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project.");
    }
  };

  const toggleServiceSelection = (serviceId: number) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-sm text-navy-300">
            Manage your project portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-600"
        >
          <Plus size={17} />
          Add Project
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-navy-800 bg-navy-950">
        <div className="overflow-x-auto">
         {loading ? (
          <p className="p-6 text-navy-300">Loading projects...</p>
         ) : projects.length === 0 ? (
          <p className="p-6 text-navy-300">No projects yet.</p>
         ) : (
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-navy-800 text-left text-navy-300">
                <th className="px-6 py-3 font-semibold">Title</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Published</th>
                <th className="px-6 py-3 font-semibold">Featured</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-navy-900 last:border-0">
                  <td className="px-6 py-4 font-medium text-white">{project.title}</td>
                  <td className="px-6 py-4 text-navy-100">{project.category}</td>
                  <td className="px-6 py-4 capitalize text-navy-100">{project.status}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      project.is_published ? "bg-green-950 text-green-400" : "bg-navy-900 text-navy-300"
                    }`}>
                      {project.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {project.featured && (
                      <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-500">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setImagesProject(project)} className="text-navy-300 transition hover:text-gold-500" aria-label="Manage images">
                        <Images size={16} />
                      </button>
                      <button type="button" onClick={() => openEditModal(project)} className="text-navy-300 transition hover:text-gold-500" aria-label="Edit">
                        <Pencil size={16} />
                      </button>
                      <button type="button" onClick={() => handleDelete(project)} className="text-navy-300 transition hover:text-red-400" aria-label="Delete">
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
          <div className="w-full max-w-2xl rounded-2xl border border-navy-800 bg-navy-950 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingSlug ? "Edit Project" : "Add Project"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-300 transition hover:bg-navy-800 hover:text-white"
                aria-label="Close"
              >
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
                <label className="text-sm font-medium text-navy-100">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-navy-100">Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-navy-100">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-navy-100">Location</label>
                  <input
                    type="text"
                    placeholder="Location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-navy-100">Client Name</label>
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={form.client_name}
                    onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-navy-100">Project Date</label>
                  <input
                    type="date"
                    value={form.project_date || ""}
                    onChange={(e) => setForm({ ...form, project_date: e.target.value || null })}
                    className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-navy-100">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ProjectInput["status"] })}
                  className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500"
                >
                  <option value="completed">Completed</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="planned">Planned</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-navy-100">Services</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleServiceSelection(service.id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        form.services.includes(service.id)
                          ? "bg-gold-500 text-navy-950"
                          : "border border-navy-700 text-navy-100 hover:bg-navy-900"
                      }`}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-navy-100">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-navy-700 bg-navy-900 accent-gold-500"
                  />
                  Featured
                </label>

                <label className="flex items-center gap-2 text-sm text-navy-100">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="h-4 w-4 rounded border-navy-700 bg-navy-900 accent-gold-500"
                  />
                  Published
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-navy-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-gold-600 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {imagesProject && (
        <ProjectImagesModal
          project={imagesProject}
          onClose={() => setImagesProject(null)}
          onChanged={loadData}
        />
      )}
    </div>
  );
}

export default ProjectsManagement;