import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X, KeyRound } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import {
  getStaffAccounts,
  createStaffAccount,
  updateStaffAccount,
  deleteStaffAccount,
  resetStaffPassword,
  type StaffAccount,
  type StaffAccountInput,
} from "../api/staff";

const roleLabels: Record<StaffAccount["role"], string> = {
  super_admin: "Super Admin",
  manager: "Manager",
  staff: "Staff",
};

const emptyForm: StaffAccountInput = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  role: "staff",
  is_active: true,
  password: "",
};

function StaffManagement() {
  const { user: currentUser } = useAuth();

  const [accounts, setAccounts] = useState<StaffAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<StaffAccountInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [resetTarget, setResetTarget] = useState<StaffAccount | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const loadAccounts = async () => {
    try {
      const data = await getStaffAccounts();
      setAccounts(data);
    } catch (error) {
      console.error("Failed to load staff accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (account: StaffAccount) => {
    setEditingId(account.id);
    setForm({
      username: account.username,
      email: account.email,
      first_name: account.first_name,
      last_name: account.last_name,
      role: account.role,
      is_active: account.is_active,
      password: "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      if (editingId) {
        const { password, ...rest } = form;
        await updateStaffAccount(editingId, rest);
      } else {
        if (!form.password || form.password.length < 8) {
          setFormError("Password must be at least 8 characters.");
          setSaving(false);
          return;
        }
        await createStaffAccount(form);
      }
      setModalOpen(false);
      await loadAccounts();
    } catch (error: any) {
      const data = error?.response?.data;
      const passwordErrors = data?.password;

      const errorMessage = Array.isArray(passwordErrors)
        ? passwordErrors.join(" ")
        : data
        ? String(Object.values(data).flat()[0])
        : "Failed to save account.";

      setFormError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (account: StaffAccount) => {
    if (account.id === currentUser?.id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!window.confirm(`Delete account "${account.username}"? This cannot be undone.`)) return;

    try {
      await deleteStaffAccount(account.id);
      await loadAccounts();
    } catch (error: any) {
      alert(error?.response?.data?.detail || "Failed to delete account.");
    }
  };

  const openResetModal = (account: StaffAccount) => {
    setResetTarget(account);
    setNewPassword("");
    setResetError(null);
  };

  const handleResetPassword = async (event: FormEvent) => {
    event.preventDefault();
    if (!resetTarget) return;

    if (newPassword.length < 8) {
      setResetError("Password must be at least 8 characters.");
      return;
    }

    setResetting(true);
    setResetError(null);

    try {
      await resetStaffPassword(resetTarget.id, newPassword);
      setResetTarget(null);
    } catch (error: any) {
      const passwordErrors = error?.response?.data?.password;
      setResetError(
        Array.isArray(passwordErrors)
          ? passwordErrors.join(" ")
          : "Failed to reset password."
      );
    } finally {
      setResetting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Staff</h1>
          <p className="mt-1 text-sm text-navy-300">
            Manage staff accounts and roles.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-600"
        >
          <Plus size={17} />
          Add Staff Account
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-navy-800 bg-navy-950">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-6 text-navy-300">Loading staff accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="p-6 text-navy-300">No staff accounts yet.</p>
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-navy-800 text-left text-navy-300">
                  <th className="px-6 py-3 font-semibold">Username</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Role</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id} className="border-b border-navy-900 last:border-0">
                    <td className="px-6 py-4 font-medium text-white">
                      {account.username}
                      {account.id === currentUser?.id && (
                        <span className="ml-2 text-xs text-navy-400">(you)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-navy-100">{account.email}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-semibold text-navy-100">
                        {roleLabels[account.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        account.is_active ? "bg-green-950 text-green-400" : "bg-navy-900 text-navy-300"
                      }`}>
                        {account.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => openResetModal(account)} className="text-navy-300 transition hover:text-gold-500" aria-label="Reset password">
                          <KeyRound size={16} />
                        </button>
                        <button type="button" onClick={() => openEditModal(account)} className="text-navy-300 transition hover:text-gold-500" aria-label="Edit">
                          <Pencil size={16} />
                        </button>
                        <button type="button" onClick={() => handleDelete(account)} className="text-navy-300 transition hover:text-red-400" aria-label="Delete">
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
                {editingId ? "Edit Staff Account" : "Add Staff Account"}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-navy-100">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-navy-100">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-navy-100">Username</label>
                <input
                  type="text"
                  required
                  disabled={!!editingId}
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 disabled:opacity-60 placeholder:text-navy-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-navy-100">Email</label>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-navy-100">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as StaffAccount["role"] })}
                  className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500"
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              {!editingId && (
                <div>
                  <label className="text-sm font-medium text-navy-100">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    minLength={8}
                    className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-500"
                  />
                  <p className="mt-1 text-xs text-navy-400">
                    At least 8 characters, not entirely numeric, and not too similar to the username or a commonly used password.
                  </p>
                </div>
              )}

              <label className="flex items-center gap-2 text-sm text-navy-100">
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
                  className="rounded-lg border border-navy-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-800"
                >
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

      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-sm rounded-2xl border border-navy-800 bg-navy-950 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Reset Password — {resetTarget.username}
              </h2>
              <button
                type="button"
                onClick={() => setResetTarget(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-300 transition hover:bg-navy-800 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="mt-5 space-y-4">
              {resetError && (
                <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-2 text-sm text-red-400">
                  {resetError}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-navy-100">New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500 placeholder:text-navy-500"
                />
                <p className="mt-1 text-xs text-navy-400">
                  At least 8 characters, not entirely numeric, and not too similar to the username or a commonly used password.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResetTarget(null)}
                  className="rounded-lg border border-navy-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-800"
                >
                  Cancel
                </button>
                <button type="submit" disabled={resetting} className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600 disabled:opacity-60">
                  {resetting ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffManagement;