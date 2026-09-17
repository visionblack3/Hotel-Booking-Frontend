import { useState } from "react";
import { createHotel, updateHotel } from "../api/adminApi";
import { extractErrorMessage } from "../api/client";
import Notice from "./Notice";

export default function HotelFormModal({ mode, hotel, onClose, onSaved }) {
  const [form, setForm] = useState({
    hotelName: hotel?.hotelName || "",
    address: hotel?.address || "",
    city: hotel?.city || "",
    descrption: hotel?.descrption || "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createHotel(form);
      } else {
        await updateHotel(hotel.id, form);
      }
      onSaved();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-40 px-6">
      <div className="bg-paper max-w-md w-full p-8 border border-line">
        <h2 className="font-display text-2xl text-ink mb-6">
          {mode === "create" ? "Add a hotel" : "Edit hotel"}
        </h2>

        {error && (
          <div className="mb-5">
            <Notice type="error">{error}</Notice>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Hotel name" value={form.hotelName} onChange={update("hotelName")} required />
          <Field label="Address" value={form.address} onChange={update("address")} required />
          <Field label="City" value={form.city} onChange={update("city")} required />
          <div>
            <label className="block text-xs uppercase tracking-wide text-stone mb-2">
              Description
            </label>
            <textarea
              value={form.descrption}
              onChange={update("descrption")}
              rows={3}
              maxLength={1000}
              className="w-full border border-line px-3 py-2 bg-transparent focus:outline-none focus:border-brass resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-line py-2.5 text-stone hover:border-ink hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-ink text-paper py-2.5 hover:bg-moss transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving\u2026" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-stone mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full border-b border-line pb-2 bg-transparent focus:outline-none focus:border-brass"
      />
    </div>
  );
}
