import { useState } from "react";
import { createRoom } from "../api/adminApi";
import { extractErrorMessage } from "../api/client";
import Notice from "./Notice";

export default function RoomFormModal({ hotelName, city, onClose, onSaved }) {
  const [form, setForm] = useState({
    roomNo: "",
    ratePerDay: "",
    roomType: "AC",
    capacity: 1,
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
      await createRoom({
        roomNo: Number(form.roomNo),
        hotelName,
        city,
        ratePerDay: Number(form.ratePerDay),
        roomType: form.roomType,
        capacity: Number(form.capacity),
      });
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
        <h2 className="font-display text-2xl text-ink mb-6">Add a room</h2>

        {error && (
          <div className="mb-5">
            <Notice type="error">{error}</Notice>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wide text-stone mb-2">
              Room number
            </label>
            <input
              required
              type="number"
              min={1}
              value={form.roomNo}
              onChange={update("roomNo")}
              className="w-full border-b border-line pb-2 bg-transparent focus:outline-none focus:border-brass"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-stone mb-2">
              Rate per night (&#8377;)
            </label>
            <input
              required
              type="number"
              min={1}
              step="0.01"
              value={form.ratePerDay}
              onChange={update("ratePerDay")}
              className="w-full border-b border-line pb-2 bg-transparent focus:outline-none focus:border-brass"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-stone mb-2">
              Room type
            </label>
            <select
              value={form.roomType}
              onChange={update("roomType")}
              className="w-full border-b border-line pb-2 bg-transparent focus:outline-none focus:border-brass"
            >
              <option value="AC">Air conditioned</option>
              <option value="NON_AC">Non air conditioned</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-stone mb-2">
              Capacity
            </label>
            <input
              required
              type="number"
              min={1}
              value={form.capacity}
              onChange={update("capacity")}
              className="w-full border-b border-line pb-2 bg-transparent focus:outline-none focus:border-brass"
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
              {submitting ? "Saving\u2026" : "Add room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
