import { useState, type ChangeEvent } from "react";
import { X, Trash2, Upload } from "lucide-react";

import { uploadProjectImage, deleteProjectImage, type Project } from "../api/projects";

interface ProjectImagesModalProps {
  project: Project;
  onClose: () => void;
  onChanged: () => void;
}

function ProjectImagesModal({ project, onClose, onChanged }: ProjectImagesModalProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      await uploadProjectImage(project.slug, file, "", project.images.length);
      onChanged();
    } catch (err) {
      console.error("Failed to upload image:", err);
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!window.confirm("Remove this image?")) return;

    setDeletingId(imageId);
    try {
      await deleteProjectImage(project.slug, imageId);
      onChanged();
    } catch (err) {
      console.error("Failed to delete image:", err);
      alert("Failed to delete image.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 py-10 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-navy-800 bg-navy-950 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            Images — {project.title}
          </h2>
          <button type="button" onClick={onClose} className="text-navy-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-800 bg-red-950/50 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {project.images.map((image) => (
            <div key={image.id} className="group relative overflow-hidden rounded-lg bg-navy-900">
              <img src={image.image} alt={image.caption || project.title} className="aspect-square w-full object-cover" />

              <button
                type="button"
                onClick={() => handleDelete(image.id)}
                disabled={deletingId === image.id}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-100"
                aria-label="Remove image"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-navy-700 text-navy-400 transition hover:border-gold-500 hover:text-gold-500">
            {uploading ? (
              <span className="text-xs">Uploading...</span>
            ) : (
              <>
                <Upload size={20} />
                <span className="text-xs">Add Image</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        {project.images.length === 0 && (
          <p className="mt-2 text-sm text-navy-500">No images yet — add one above.</p>
        )}
      </div>
    </div>
  );
}

export default ProjectImagesModal;