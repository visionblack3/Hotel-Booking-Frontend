import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, registerAdmin } from "../api/authApi";
import { extractErrorMessage } from "../api/client";
import Notice from "../components/Notice";

export default function Register({ admin = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const fn = admin ? registerAdmin : registerUser;
      await fn(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <p className="text-brassDark text-sm mb-2">
        {admin ? "Property owner" : "Guest"}
      </p>
      <h1 className="font-display text-3xl text-ink mb-1">
        {admin ? "Register your property" : "Create an account"}
      </h1>
      <p className="text-stone text-sm mb-8">
        {admin
          ? "List and manage hotels once you're signed in."
          : "Book rooms and keep every stay in one place."}
      </p>

      {error && (
        <div className="mb-6">
          <Notice type="error">{error}</Notice>
        </div>
      )}
      {success && (
        <div className="mb-6">
          <Notice type="success">Account created. Redirecting to sign in&hellip;</Notice>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-wide text-stone mb-2">
            Username
          </label>
          <input
            required
            value={form.username}
            onChange={update("username")}
            className="w-full border-b border-line pb-2 bg-transparent focus:outline-none focus:border-brass"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-stone mb-2">
            Email
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
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
            minLength={6}
            value={form.password}
            onChange={update("password")}
            className="w-full border-b border-line pb-2 bg-transparent focus:outline-none focus:border-brass"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-paper py-3 hover:bg-moss transition-colors disabled:opacity-50"
        >
          {submitting ? "Creating account\u2026" : "Create account"}
        </button>
      </form>

      <p className="text-stone text-sm mt-8">
        Already have an account?{" "}
        <Link to="/login" className="text-brassDark hover:text-ink">
          Sign in
        </Link>
      </p>
    </div>
  );
}
