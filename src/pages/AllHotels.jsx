import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllHotels } from "../api/userApi";
import { extractErrorMessage } from "../api/client";
import Notice from "../components/Notice";

export default function AllHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllHotels()
      .then(setHotels)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-brassDark text-sm mb-2">Browse</p>
      <h1 className="font-display text-4xl text-ink mb-8">All hotels</h1>

      {error && (
        <div className="mb-8">
          <Notice type="error">{error}</Notice>
        </div>
      )}

      {loading && <p className="text-stone">Loading hotels&hellip;</p>}

      {!loading && hotels.length === 0 && !error && (
        <div className="border border-line px-6 py-10 text-center">
          <p className="text-ink font-display text-xl mb-2">
            No hotels listed yet
          </p>
          <p className="text-stone text-sm">Check back soon.</p>
        </div>
      )}

      <div className="divide-y divide-line border-t border-b border-line">
        {hotels.map((h) => (
          <Link
            key={h.id}
            to={`/hotels/${h.id}`}
            state={{ hotel: h }}
            className="py-6 grid md:grid-cols-[2fr_1fr_auto] gap-4 items-center group"
          >
            <div>
              <p className="font-display text-xl text-ink group-hover:text-brassDark transition-colors">
                {h.hotelName}
              </p>
              <p className="text-stone text-sm mt-1">
                {h.address}, {h.city}
              </p>
              {h.desc && (
                <p className="text-stone text-sm mt-1 line-clamp-1">{h.desc}</p>
              )}
            </div>
            <div className="text-sm text-stone">
              {h.rating ? `Rated ${h.rating}/5` : "Not yet rated"}
            </div>
            <div className="justify-self-start md:justify-self-end text-sm text-brassDark group-hover:text-ink transition-colors">
              Check availability &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
