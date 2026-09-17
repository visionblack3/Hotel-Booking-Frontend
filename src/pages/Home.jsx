import { useState } from "react";
import { useNavigate } from "react-router-dom";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function Home() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [checkin, setCheckin] = useState(todayISO());
  const [checkout, setCheckout] = useState(tomorrowISO());
  const [occupants, setOccupants] = useState(2);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      city: city.trim(),
      checkin,
      checkout,
      occupants: String(occupants),
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-5 gap-12 items-end">
          <div className="md:col-span-3">
            <p className="text-brassDark text-sm mb-4">Rooms in over forty cities</p>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-ink">
              A quieter way
              <br />
              to book a room.
            </h1>
            <p className="mt-6 text-stone max-w-md leading-relaxed">
              Search real availability across independent hotels, hold your
              room in a few clicks, and keep every booking in one ledger.
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative">
        <form
          onSubmit={handleSearch}
          className="bg-ink text-paper p-8 md:p-10 grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-6 items-end"
        >
          <div>
            <label className="block text-xs uppercase tracking-wide text-paper/60 mb-2">
              City
            </label>
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
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
              min={todayISO()}
              value={checkin}
              onChange={(e) => {
                const nextCheckin = e.target.value;
                setCheckin(nextCheckin);
                if (nextCheckin >= checkout) {
                  const d = new Date(nextCheckin);
                  d.setDate(d.getDate() + 1);
                  setCheckout(d.toISOString().slice(0, 10));
                }
              }}
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
              min={checkin}
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
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
              value={occupants}
              onChange={(e) => setOccupants(Math.max(1, parseInt(e.target.value, 10) || 1))}
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
      </section>
    </div>
  );
}