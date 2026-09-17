import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Notice from "../components/Notice";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const dest =
      location.state?.from ||
      (result.user.role === "ADMIN" ? "/admin" : "/search");
    navigate(dest, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-ink mb-1">Sign in</h1>
      <p className="text-stone text-sm mb-8">
        Access your bookings or your hotel dashboard.
      </p>

      {error && (
        <div className="mb-6">
          <Notice type="error">{error}</Notice>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-wide text-stone mb-2">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-line pb-2 bg-transparent focus:outline-none focus:border-brass"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-stone mb-2">
            Password
          </label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-line pb-2 bg-transparent focus:outline-none focus:border-brass"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-paper py-3 hover:bg-moss transition-colors disabled:opacity-50"
        >
          {submitting ? "Signing in\u2026" : "Sign in"}
        </button>
      </form>

      <p className="text-stone text-sm mt-8">
        New here?{" "}
        <Link to="/register" className="text-brassDark hover:text-ink">
          Create a guest account
        </Link>
        <br />
        Managing a property?{" "}
        <Link to="/register-admin" className="text-brassDark hover:text-ink">
          Register as an owner
        </Link>
      </p>
    </div>
  );
}
