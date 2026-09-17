import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchByCity } from "../api/userApi";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Notice from "../components/Notice";

function nights(checkin, checkout) {
  const a = new Date(checkin);
  const b = new Date(checkout);
  return Math.max(1, Math.round((b - a) / (1000 * 60 * 60 * 24)));
}

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const city = params.get("city") || "";
  const checkin = params.get("checkin") || "";
  const checkout = params.get("checkout") || "";
  const occupants = params.get("occupants") || "1";

  const hasQuery = !!(city && checkin && checkout);

  const [form, setForm] = useState({ city, checkin, checkout, occupants });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(hasQuery);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasQuery) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    searchByCity({ city, checkin, checkout, occupants })
      .then(setRooms)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [city, checkin, checkout, occupants, hasQuery]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setParams({
      city: form.city.trim(),
      checkin: form.checkin,
      checkout: form.checkout,
      occupants: String(form.occupants || 1),
    });
  };

  const stayNights = checkin && checkout ? nights(checkin, checkout) : 1;

  const handleBook = (room) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/search" } });
      return;
    }
    if (isAdmin) return;
    navigate("/booking/confirm", {
      state: {
        hotelId: room.hotelId,
        hotelName: room.hotelName,
        address: room.address,
        city: room.city,
        roomType: room.type,
        checkin,
        checkout,
        occupants: Number(occupants),
        nights: stayNights,
        ratePerDay: room.totalPrice / stayNights,
        estimatedTotal: room.totalPrice,
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-brassDark text-sm mb-2">Find a room</p>
        <h1 className="font-display text-4xl text-ink">
          {hasQuery ? `Rooms in ${city}` : "Search availability"}
        </h1>
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="bg-ink text-paper p-6 md:p-8 grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-6 items-end mb-10"
      >
        <div>
          <label className="block text-xs uppercase tracking-wide text-paper/60 mb-2">
            City
          </label>
          <input
            required
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            placeholder="Where are you headed?"
            className="w-full bg-transparent border-b border-paper/30 pb-2 text-paper placeholder:text-paper/40 focus:outline-none focus:border-brass"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-paper/60 mb-2">
            Check in
          </label>
          <input
            required
            type="date"
            value={form.checkin}
            onChange={(e) => setForm((f) => ({ ...f, checkin: e.target.value }))}
            className="w-full bg-transparent border-b border-paper/30 pb-2 text-paper focus:outline-none focus:border-brass"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-paper/60 mb-2">
            Check out
          </label>
          <input
            required
            type="date"
            min={form.checkin || undefined}
            value={form.checkout}
            onChange={(e) => setForm((f) => ({ ...f, checkout: e.target.value }))}
            className="w-full bg-transparent border-b border-paper/30 pb-2 text-paper focus:outline-none focus:border-brass"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-paper/60 mb-2">
            Guests
          </label>
          <input
            required
            type="number"
            min={1}
            value={form.occupants}
            onChange={(e) => setForm((f) => ({ ...f, occupants: e.target.value }))}
            className="w-full bg-transparent border-b border-paper/30 pb-2 text-paper focus:outline-none focus:border-brass"
          />
        </div>
        <button
          type="submit"
          className="bg-brass text-ink px-6 py-3 font-medium hover:bg-paper transition-colors"
        >
          Search
        </button>
      </form>

      {!hasQuery && !error && (
        <div className="border border-line px-6 py-10 text-center">
          <p className="text-ink font-display text-xl mb-2">
            Enter a city and your dates
          </p>
          <p className="text-stone text-sm">
            Fill in the search above to see rooms with real availability.
          </p>
        </div>
      )}

      {hasQuery && (
        <p className="text-brassDark text-sm mb-4">
          {checkin} &rarr; {checkout} &middot; {occupants} guest
          {Number(occupants) > 1 ? "s" : ""}
        </p>
      )}

      {error && (
        <div className="mb-8">
          <Notice type="error">{error}</Notice>
        </div>
      )}

      {hasQuery && loading && <p className="text-stone">Checking availability&hellip;</p>}

      {hasQuery && !loading && !error && rooms.length === 0 && (
        <div className="border border-line px-6 py-10 text-center">
          <p className="text-ink font-display text-xl mb-2">No rooms open up</p>
          <p className="text-stone text-sm">
            Try different dates, a smaller party, or another city.
          </p>
        </div>
      )}

      <div className="divide-y divide-line border-t border-b border-line">
        {rooms.map((room) => (
          <div
            key={room.roomId}
            className="py-6 grid md:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center"
          >
            <div>
              <p className="font-display text-xl text-ink">{room.hotelName}</p>
              <p className="text-stone text-sm mt-1">
                {room.address}, {room.city}
              </p>
            </div>
            <div className="text-sm text-stone">
              {room.type === "AC" ? "Air conditioned" : "Non air conditioned"}
              <br />
              Sleeps up to {room.capacity}
            </div>
            <div className="text-ink">
              <span className="font-display text-2xl">
                &#8377;{room.totalPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-stone text-sm">
                {" "}
                / {stayNights} night{stayNights > 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={() => handleBook(room)}
              disabled={isAdmin}
              className="justify-self-start md:justify-self-end px-5 py-2.5 bg-ink text-paper hover:bg-moss transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isAdmin ? "Admin account" : "Reserve"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
