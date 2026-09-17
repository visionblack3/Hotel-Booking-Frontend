import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "../api/userApi";
import { extractErrorMessage } from "../api/client";
import StatusBadge from "../components/StatusBadge";
import Notice from "../components/Notice";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [rowErrors, setRowErrors] = useState({});

  const load = () => {
    setLoading(true);
    setError("");
    getMyBookings()
      .then(setBookings)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId);
    setRowErrors((prev) => ({ ...prev, [bookingId]: "" }));
    try {
      const updated = await cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.bookingId === updated.bookingId ? updated : b))
      );
    } catch (err) {
      setRowErrors((prev) => ({
        ...prev,
        [bookingId]: extractErrorMessage(err),
      }));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <p className="text-brassDark text-sm mb-2">Your ledger</p>
      <h1 className="font-display text-4xl text-ink mb-8">My bookings</h1>

      {error && (
        <div className="mb-6">
          <Notice type="error">{error}</Notice>
        </div>
      )}

      {loading && <p className="text-stone">Loading your bookings&hellip;</p>}

      {!loading && bookings.length === 0 && !error && (
        <div className="border border-line px-6 py-10 text-center">
          <p className="text-ink font-display text-xl mb-2">
            Nothing booked yet
          </p>
          <p className="text-stone text-sm">
            Search for a room and your reservations will show up here.
          </p>
        </div>
      )}

      <div className="divide-y divide-line border-t border-b border-line">
        {bookings.map((b) => {
          const isCancelled = b.status === "CANCELLED";
          return (
            <div key={b.bookingId} className="py-6">
              <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center">
                <div>
                  <p className="font-display text-lg text-ink">{b.hotelName}</p>
                  <p className="text-stone text-sm">
                    {b.address}, {b.city}
                  </p>
                </div>
                <div className="text-sm text-stone">
                  {b.checkin} &rarr; {b.checkout}
                  <br />
                  {b.numberOfNights} night{b.numberOfNights > 1 ? "s" : ""}
                </div>
                <div className="text-sm text-ink">
                  &#8377;{b.totalPrice.toLocaleString("en-IN")}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={b.status} />
                  <StatusBadge status={b.paymentStatus ?? undefined} />
                </div>
                <div className="justify-self-start md:justify-self-end">
                  {isCancelled ? (
                    <span className="text-sm text-stone/50">Cancelled</span>
                  ) : (
                    <button
                      onClick={() => handleCancel(b.bookingId)}
                      disabled={cancellingId === b.bookingId}
                      className="text-sm border border-rust text-rust px-4 py-2 hover:bg-rust hover:text-paper transition-colors disabled:opacity-50"
                    >
                      {cancellingId === b.bookingId ? "Cancelling\u2026" : "Cancel booking"}
                    </button>
                  )}
                </div>
              </div>
              {rowErrors[b.bookingId] && (
                <div className="mt-3">
                  <Notice type="error">{rowErrors[b.bookingId]}</Notice>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
