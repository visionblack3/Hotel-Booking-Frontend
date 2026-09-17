import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getHotelDashboard,
  deleteHotel,
  deleteRoom,
} from "../api/adminApi";
import { getAllHotels } from "../api/userApi";
import { extractErrorMessage } from "../api/client";
import Notice from "../components/Notice";
import StatusBadge from "../components/StatusBadge";
import HotelFormModal from "../components/HotelFormModal";
import RoomFormModal from "../components/RoomFormModal";

const TABS = ["Overview", "Bookings", "Guests", "Payments"];

export default function AdminHotelDetail() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null); // full HotelResponseDto, for editing
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Overview");

  const [showEditHotel, setShowEditHotel] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [roomNoToDelete, setRoomNoToDelete] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionBusy, setActionBusy] = useState(false);

  const load = () => {
    setLoading(true);
    setError("");
    Promise.all([getHotelDashboard(hotelId), getAllHotels()])
      .then(([dashboard, hotels]) => {
        setData(dashboard);
        setHotelDetails(hotels.find((h) => String(h.id) === String(hotelId)) || null);
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [hotelId]);

  const handleDeleteHotel = async () => {
    if (!window.confirm(`Delete ${data.hotelName}? This cannot be undone.`)) return;
    setActionBusy(true);
    setActionError("");
    try {
      await deleteHotel(hotelId);
      navigate("/admin");
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setActionBusy(false);
    }
  };

  const handleDeleteRoom = async (e) => {
    e.preventDefault();
    if (!roomNoToDelete) return;
    setActionBusy(true);
    setActionError("");
    try {
      await deleteRoom(hotelId, roomNoToDelete);
      setRoomNoToDelete("");
      load();
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setActionBusy(false);
    }
  };

  if (loading) {
    return <p className="max-w-6xl mx-auto px-6 py-12 text-stone">Loading dashboard&hellip;</p>;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Notice type="error">{error}</Notice>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-brassDark text-sm mb-2">{data.city}</p>
          <h1 className="font-display text-4xl text-ink">{data.hotelName}</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddRoom(true)}
            className="border border-ink text-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors text-sm"
          >
            Add room
          </button>
          <button
            onClick={() => setShowEditHotel(true)}
            className="border border-ink text-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors text-sm"
          >
            Edit hotel
          </button>
          <button
            onClick={handleDeleteHotel}
            disabled={actionBusy}
            className="border border-rust text-rust px-4 py-2 hover:bg-rust hover:text-paper transition-colors text-sm disabled:opacity-50"
          >
            Delete hotel
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mb-6">
          <Notice type="error">{actionError}</Notice>
        </div>
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-line border border-line mb-10">
        <Stat label="Total rooms" value={data.stats.totalRooms} />
        <Stat label="Occupied" value={data.stats.occupiedRooms} />
        <Stat label="Available" value={data.stats.availableRooms} />
        <Stat label="Bookings" value={data.stats.totalBookingsCount} />
        <Stat
          label="Occupancy"
          value={`${data.stats.occupancyRatePercentage.toFixed(0)}%`}
        />
      </div>

      {/* Remove a room */}
      <form
        onSubmit={handleDeleteRoom}
        className="mb-10 flex items-end gap-3 border border-line px-5 py-4"
      >
        <div>
          <label className="block text-xs uppercase tracking-wide text-stone mb-2">
            Remove room by number
          </label>
          <input
            type="number"
            min={1}
            value={roomNoToDelete}
            onChange={(e) => setRoomNoToDelete(e.target.value)}
            placeholder="e.g. 101"
            className="border-b border-line pb-2 bg-transparent focus:outline-none focus:border-brass w-40"
          />
        </div>
        <button
          type="submit"
          disabled={actionBusy || !roomNoToDelete}
          className="text-rust hover:text-ink transition-colors text-sm pb-2.5 disabled:opacity-40"
        >
          Delete room
        </button>
      </form>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-line mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm transition-colors ${
              tab === t
                ? "text-ink border-b-2 border-brass"
                : "text-stone hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="text-stone text-sm leading-relaxed max-w-xl">
          <p>
            {data.hotelName} in {data.city} currently has{" "}
            {data.stats.availableRooms} of {data.stats.totalRooms} rooms free,
            across {data.stats.totalBookingsCount} bookings recorded to date.
          </p>
        </div>
      )}

      {tab === "Bookings" && (
        <div className="divide-y divide-line border-t border-b border-line">
          {data.bookings.length === 0 && (
            <p className="py-6 text-stone text-sm">No bookings yet.</p>
          )}
          {data.bookings.map((b) => (
            <div
              key={b.bookingId}
              className="py-4 grid md:grid-cols-[1fr_2fr_1fr_1fr_auto] gap-4 items-center text-sm"
            >
              <span className="text-ink">Room {b.roomNo}</span>
              <span className="text-stone">
                {b.guestName} &middot; {b.guestEmail}
              </span>
              <span className="text-stone">
                {b.checkinDate} &rarr; {b.checkoutDate}
              </span>
              <span className="text-ink">
                &#8377;{b.totalAmount.toLocaleString("en-IN")}
              </span>
              <div className="flex gap-2">
                <StatusBadge status={b.bookingStatus} />
                <StatusBadge status={b.paymentStatus} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Guests" && (
        <div className="divide-y divide-line border-t border-b border-line">
          {data.registeredGuests.length === 0 && (
            <p className="py-6 text-stone text-sm">No guests yet.</p>
          )}
          {data.registeredGuests.map((g) => (
            <div
              key={g.userId}
              className="py-4 grid md:grid-cols-3 gap-4 items-center text-sm"
            >
              <span className="text-ink">{g.name}</span>
              <span className="text-stone">{g.email}</span>
              <span className="text-stone">
                {g.totalBookingsAtHotel} booking
                {g.totalBookingsAtHotel === 1 ? "" : "s"}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "Payments" && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-line border border-line mb-6">
            <Stat
              label="Revenue"
              value={`\u20B9${data.payments.totalRevenue.toLocaleString("en-IN")}`}
            />
            <Stat
              label="Pending"
              value={`\u20B9${data.payments.pendingRevenue.toLocaleString("en-IN")}`}
            />
            <Stat label="Successful" value={data.payments.successfulPaymentsCount} />
            <Stat label="Pending count" value={data.payments.pendingPaymentsCount} />
          </div>
          <div className="divide-y divide-line border-t border-b border-line">
            {data.payments.transactions.length === 0 && (
              <p className="py-6 text-stone text-sm">No transactions yet.</p>
            )}
            {data.payments.transactions.map((t) => (
              <div
                key={t.bookingId}
                className="py-4 grid md:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center text-sm"
              >
                <span className="text-stone">
                  {t.guestName} &middot; {t.guestEmail}
                </span>
                <span className="text-stone">{t.transactionDate}</span>
                <span className="text-ink">
                  &#8377;{t.amount.toLocaleString("en-IN")}
                </span>
                <StatusBadge status={t.paymentStatus} />
              </div>
            ))}
          </div>
        </div>
      )}

      {showEditHotel && (
        <HotelFormModal
          mode="edit"
          hotel={
            hotelDetails || {
              id: hotelId,
              hotelName: data.hotelName,
              address: "",
              city: data.city,
              desc: "",
            }
          }
          onClose={() => setShowEditHotel(false)}
          onSaved={() => {
            setShowEditHotel(false);
            load();
          }}
        />
      )}

      {showAddRoom && (
        <RoomFormModal
          hotelName={data.hotelName}
          city={data.city}
          onClose={() => setShowAddRoom(false)}
          onSaved={() => {
            setShowAddRoom(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="px-5 py-5 first:pl-0">
      <p className="font-display text-2xl text-ink">{value}</p>
      <p className="text-xs uppercase tracking-wide text-stone mt-1">{label}</p>
    </div>
  );
}
