import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getAllHotels, searchByCity } from "../api/userApi";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Notice from "../components/Notice";
import { todayISO, tomorrowISO, nightsBetween } from "../utils/date";

export default function HotelDetail() {
  const { hotelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const [hotel, setHotel] = useState(location.state?.hotel || null);
  const [hotelLoading, setHotelLoading] = useState(!location.state?.hotel);
  const [hotelError, setHotelError] = useState("");

  const [form, setForm] = useState({
    checkin: todayISO(),
    checkout: tomorrowISO(),
    occupants: 2,
  });
  const [rooms, setRooms] = useState(null); // null = availability not checked yet
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hotel) return;
    setHotelLoading(true);
    getAllHotels()
      .then((all) => {
        const found = all.find((h) => String(h.id) === String(hotelId));
        if (!found) {
          setHotelError("Hotel not found.");
        } else {
          setHotel(found);
        }
      })
      .catch((err) => setHotelError(extractErrorMessage(err)))
      .finally(() => setHotelLoading(false));
  }, [hotelId, hotel]);

  const stayNights = nightsBetween(form.checkin, form.checkout);

  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    if (!hotel) return;
    setSearching(true);
    setError("");
    try {
      const results = await searchByCity({
        city: hotel.city,
        checkin: form.checkin,
        checkout: form.checkout,
        occupants: form.occupants,
      });
      setRooms(results.filter((r) => String(r.hotelId) === String(hotelId)));
    } catch (err) {
      setError(extractErrorMessage(err));
      setRooms(null);
    } finally {
      setSearching(false);
    }
  };

  const handleBook = (room) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/hotels/${hotelId}` } });
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
        checkin: form.checkin,
        checkout: form.checkout,
        occupants: Number(form.occupants),
        nights: stayNights,
        ratePerDay: room.totalPrice / stayNights,
        estimatedTotal: room.totalPrice,
      },
    });
  };

  if (hotelLoading) {
    return (
      <p className="max-w-4xl mx-auto px-6 py-12 text-stone">
        Loading hotel&hellip;
      </p>
    );
  }

  if (hotelError || !hotel) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Notice type="error">{hotelError || "Hotel not found."}</Notice>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <p className="text-brassDark text-sm mb-2">{hotel.city}</p>
      <h1 className="font-display text-4xl text-ink mb-2">{hotel.hotelName}</h1>
      <p className="text-stone text-sm mb-1">{hotel.address}</p>
      {hotel.rating != null && (
        <p className="text-stone text-sm mb-4">Rated {hotel.rating}/5</p>
      )}
      {hotel.desc && (
        <p className="text-stone text-sm leading-relaxed mb-8 max-w-xl">
          {hotel.desc}
        </p>
      )}

      <form
        onSubmit={handleCheckAvailability}
        className="bg-ink text-paper p-6 md:p-8 grid md:grid-cols-[1fr_1fr_1fr_auto] gap-6 items-end mb-10"
      >
        <div>
          <label className="block text-xs uppercase tracking-wide text-paper/60 mb-2">
            Check in
          </label>
          <input
            required
            type="date"
            min={todayISO()}
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
            min={form.checkin}
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
          disabled={searching}
          className="bg-brass text-ink px-6 py-3 font-medium hover:bg-paper transition-colors disabled:opacity-50"
        >
          {searching ? "Checking\u2026" : "Check availability"}
        </button>
      </form>

      {error && (
        <div className="mb-8">
          <Notice type="error">{error}</Notice>
        </div>
      )}

      {rooms !== null && rooms.length === 0 && !error && (
        <div className="border border-line px-6 py-10 text-center">
          <p className="text-ink font-display text-xl mb-2">No rooms open up</p>
          <p className="text-stone text-sm">
            Try different dates or a smaller party.
          </p>
        </div>
      )}

      {rooms !== null && rooms.length > 0 && (
        <div className="divide-y divide-line border-t border-b border-line">
          {rooms.map((room) => (
            <div
              key={room.roomId}
              className="py-6 grid md:grid-cols-[1fr_1fr_auto] gap-4 items-center"
            >
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
      )}
    </div>
  );
}
