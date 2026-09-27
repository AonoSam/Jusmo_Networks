import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User as UserIcon } from "lucide-react";

import { useAuth } from "../hooks/useAuth";

const REMEMBERED_USERNAME_KEY = "jusmo_remembered_username";

function StaffLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Pre-fill the username field if one was remembered from a previous login.
  // The password is never stored, for anyone, under any setting — only the
  // username is persisted, purely as a convenience.
  useEffect(() => {
    const savedUsername = localStorage.getItem(REMEMBERED_USERNAME_KEY);
    if (savedUsername) {
      setUsername(savedUsername);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login({ username, password });

      if (remember) {
        localStorage.setItem(REMEMBERED_USERNAME_KEY, username);
      } else {
        localStorage.removeItem(REMEMBERED_USERNAME_KEY);
      }

      navigate("/staff/dashboard", { replace: true });
    } catch (err: any) {
      const detail =
        err?.response?.data?.non_field_errors?.[0] ||
        err?.response?.data?.detail ||
        "Invalid username or password.";
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center bg-navy-950 bg-cover bg-center px-6 lg:justify-start lg:pl-24"
      style={{ backgroundImage: "url('/images/staff-login-bg.png')" }}
    >
      <div className="absolute inset-0 bg-navy-950/40" />

      <div className="relative w-full max-w-md rounded-2xl border border-navy-800 bg-navy-900/95 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">
            JUSMO<span className="text-gold-500"> NETWORKS</span>
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-navy-400">
            Staff Administration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="text-sm font-medium text-navy-100">
              Username
            </label>
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-navy-700 bg-navy-950 px-4 py-3">
              <UserIcon size={18} className="text-navy-400" />
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent text-white outline-none placeholder:text-navy-500"
                placeholder="Username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-navy-100">
              Password
            </label>
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-navy-700 bg-navy-950 px-4 py-3">
              <Lock size={18} className="text-navy-400" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white outline-none placeholder:text-navy-500"
                placeholder="Password"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-navy-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-navy-700 bg-navy-950 accent-gold-500"
            />
            Remember my username
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gold-500 py-3 font-semibold text-navy-950 transition hover:bg-gold-600 disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StaffLogin;