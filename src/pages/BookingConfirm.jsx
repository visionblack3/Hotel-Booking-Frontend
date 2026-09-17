import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { createBooking, confirmPayment } from "../api/userApi";
import { extractErrorMessage } from "../api/client";
import { loadRazorpayScript } from "../utils/razorpay";
import { useAuth } from "../context/AuthContext";
import Notice from "../components/Notice";
import StatusBadge from "../components/StatusBadge";

const STAGES = {
  REVIEW: "review",
  PAYING: "paying",
  DONE: "done",
};

export default function BookingConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const draft = location.state;

  const [stage, setStage] = useState(STAGES.REVIEW);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!draft) {
    return <Navigate to="/hotels" replace />;
  }

  const handleReserve = async () => {
    setError("");
    setSubmitting(true);
    try {
      const result = await createBooking({
        hotelId: draft.hotelId,
        roomType: draft.roomType,
        checkin: draft.checkin,
        checkout: draft.checkout,
        occupants: draft.occupants,
      });
      setBooking(result);
      setStage(STAGES.PAYING);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async () => {
    setError("");
    setSubmitting(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError(
        "Couldn't load the Razorpay checkout script. Check your connection and try again."
      );
      setSubmitting(false);
      return;
    }

    const options = {
      key: booking.razorpayKeyId,
      amount: Math.round(booking.totalPrice * 100),
      currency: booking.currency || "INR",
      order_id: booking.razorpayOrderId,
      name: "Fernwood & Co.",
      description: `${draft.hotelName} \u2014 ${draft.checkin} to ${draft.checkout}`,
      prefill: {
        name: user?.username,
        email: user?.email,
      },
      theme: { color: "#A9793B" },
      handler: async (response) => {
        // response holds the signed payment details from Razorpay:
        // razorpay_payment_id, razorpay_order_id, razorpay_signature.
        // Send these to the backend so it can verify the signature and
        // flip the booking to BOOKED / SUCCESS.
        try {
          const confirmed = await confirmPayment({
            bookingId: booking.bookingId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          setBooking(confirmed);
          setStage(STAGES.DONE);
        } catch (err) {
          setError(extractErrorMessage(err));
        } finally {
          setSubmitting(false);
        }
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (resp) => {
      setError(resp.error?.description || "Payment failed. Please try again.");
      setSubmitting(false);
    });
    rzp.open();
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-brassDark text-sm mb-2">Reservation</p>
      <h1 className="font-display text-3xl text-ink mb-8">
        {draft.hotelName}
      </h1>

      <div className="border border-line divide-y divide-line mb-8">
        <Row label="Address" value={`${draft.address}, ${draft.city}`} />
        <Row label="Room type" value={draft.roomType === "AC" ? "Air conditioned" : "Non air conditioned"} />
        <Row label="Check in" value={draft.checkin} />
        <Row label="Check out" value={draft.checkout} />
        <Row label="Guests" value={draft.occupants} />
        <Row label="Nights" value={draft.nights} />
        <Row label="Rate per night" value={`\u20B9${draft.ratePerDay.toLocaleString("en-IN")}`} />
        <Row
          label="Estimated total"
          value={`\u20B9${draft.estimatedTotal.toLocaleString("en-IN")}`}
          emphasize
        />
      </div>

      {error && (
        <div className="mb-6">
          <Notice type="error">{error}</Notice>
        </div>
      )}

      {stage === STAGES.REVIEW && (
        <button
          onClick={handleReserve}
          disabled={submitting}
          className="w-full bg-ink text-paper py-3.5 hover:bg-moss transition-colors disabled:opacity-50"
        >
          {submitting ? "Holding your room\u2026" : "Reserve and continue to payment"}
        </button>
      )}

      {stage === STAGES.PAYING && booking && (
        <div className="border border-line p-6">
          <p className="text-xs uppercase tracking-wide text-stone mb-1">
            Booking #{booking.bookingId} &middot; awaiting payment
          </p>
          <p className="font-display text-2xl text-ink mb-4">
            &#8377;{booking.totalPrice.toLocaleString("en-IN")}
          </p>
          <p className="text-stone text-sm mb-6">
            This opens Razorpay Checkout in test mode. Use a{" "}
            <a
              href="https://razorpay.com/docs/payments/payments/test-card-details/"
              target="_blank"
              rel="noreferrer"
              className="text-brassDark hover:text-ink underline"
            >
              Razorpay test card
            </a>{" "}
            to complete it &mdash; nothing is charged.
          </p>
          <button
            onClick={handlePay}
            disabled={submitting}
            className="w-full bg-brass text-ink py-3.5 font-medium hover:bg-brassDark hover:text-paper transition-colors disabled:opacity-50"
          >
            {submitting ? "Opening checkout\u2026" : "Pay with Razorpay"}
          </button>
        </div>
      )}

      {stage === STAGES.DONE && booking && (
        <div className="border border-moss/40 bg-moss/5 p-8 text-center">
          <p className="font-display text-2xl text-ink mb-3">
            Your stay is booked
          </p>
          <div className="flex gap-2 justify-center mb-6">
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.paymentStatus} />
          </div>
          <p className="text-stone text-sm mb-6 leading-relaxed">
            Booking #{booking.bookingId} was verified and confirmed.
          </p>
          <button
            onClick={() => navigate("/my-bookings")}
            className="bg-ink text-paper px-6 py-3 hover:bg-moss transition-colors"
          >
            View my bookings
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, emphasize }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-stone text-sm">{label}</span>
      <span className={emphasize ? "font-display text-lg text-ink" : "text-ink text-sm"}>
        {value}
      </span>
    </div>
  );
}
