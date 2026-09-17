import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllHotels } from "../api/userApi";
import { extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Notice from "../components/Notice";
import HotelFormModal from "../components/HotelFormModal";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const load = () => {
    setLoading(true);
    setError("");
    getAllHotels()
      .then((all) =>
        setHotels(all.filter((h) => h.ownerEmail === user?.email))
      )
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [user?.email]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-brassDark text-sm mb-2">Owner dashboard</p>
          <h1 className="font-display text-4xl text-ink">Your properties</h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-ink text-paper px-5 py-2.5 hover:bg-moss transition-colors"
        >
          Add a hotel
        </button>
      </div>

      {error && (
        <div className="mb-6">
          <Notice type="error">{error}</Notice>
        </div>
      )}

      {loading && <p className="text-stone">Loading your properties&hellip;</p>}

      {!loading && hotels.length === 0 && !error && (
        <div className="border border-line px-6 py-10 text-center">
          <p className="text-ink font-display text-xl mb-2">
            No properties yet
          </p>
          <p className="text-stone text-sm mb-6">
            Add your first hotel to start tracking rooms and bookings.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-ink text-paper px-5 py-2.5 hover:bg-moss transition-colors"
          >
            Add a hotel
          </button>
        </div>
      )}

      <div className="divide-y divide-line border-t border-b border-line">
        {hotels.map((h) => (
          <Link
            key={h.id}
            to={`/admin/hotels/${h.id}`}
            className="py-6 grid md:grid-cols-[2fr_1fr_auto] gap-4 items-center group"
          >
            <div>
              <p className="font-display text-xl text-ink group-hover:text-brassDark transition-colors">
                {h.hotelName}
              </p>
              <p className="text-stone text-sm mt-1">
                {h.address}, {h.city}
              </p>
            </div>
            <div className="text-sm text-stone">
              {h.rating ? `Rated ${h.rating}/5` : "Not yet rated"}
            </div>
            <div className="justify-self-start md:justify-self-end text-sm text-brassDark group-hover:text-ink transition-colors">
              Manage &rarr;
            </div>
          </Link>
        ))}
      </div>

      {showCreate && (
        <HotelFormModal
          mode="create"
          onClose={() => setShowCreate(false)}
          onSaved={() => {
            setShowCreate(false);
            load();
          }}
        />
      )}
    </div>
  );
}
