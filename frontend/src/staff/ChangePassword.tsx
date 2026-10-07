import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, KeyRound } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { changePassword } from "../api/auth";

function ChangePassword() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        first_name: firstName,
        last_name: lastName,
        email,
      });

      await refreshUser();
      navigate("/staff/dashboard", { replace: true });
    } catch (err: any) {
      const data = err?.response?.data;
      const message = data
        ? String(Object.values(data).flat()[0])
        : "Failed to change password.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-navy-900 px-6">
      <div className="w-full max-w-md rounded-2xl border border-navy-800 bg-navy-950 p-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15">
            <KeyRound size={22} className="text-gold-500" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-white">Set Your Password</h1>
          <p className="mt-2 text-sm text-navy-300">
            This account is still using a default password. Set a new one to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-navy-100">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy-100">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-navy-100">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-gold-500"
            />
          </div>

          <div className="border-t border-navy-800 pt-4">
            <label className="text-sm font-medium text-navy-100">Current (Default) Password</label>
            <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-navy-700 bg-navy-900 px-3 py-2">
              <Lock size={16} className="text-navy-400" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-navy-100">New Password</label>
            <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-navy-700 bg-navy-900 px-3 py-2">
              <Lock size={16} className="text-navy-400" />
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-navy-400">
              At least 8 characters, not entirely numeric, and not too similar to the username or a commonly used password.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-navy-100">Confirm New Password</label>
            <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-navy-700 bg-navy-900 px-3 py-2">
              <Lock size={16} className="text-navy-400" />
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gold-500 py-3 font-semibold text-navy-950 transition hover:bg-gold-600 disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Set Password & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;