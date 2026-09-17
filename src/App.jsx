import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import AllHotels from "./pages/AllHotels";
import HotelDetail from "./pages/HotelDetail";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingConfirm from "./pages/BookingConfirm";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHotelDetail from "./pages/AdminHotelDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-paper">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<AllHotels />} />
            <Route path="/hotels/:hotelId" element={<HotelDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register admin={false} />} />
            <Route path="/register-admin" element={<Register admin={true} />} />

            <Route
              path="/booking/confirm"
              element={
                <ProtectedRoute>
                  <BookingConfirm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/hotels/:hotelId"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminHotelDetail />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="border-t border-line">
          <div className="max-w-6xl mx-auto px-6 py-8 text-xs text-stone flex justify-between flex-wrap gap-2">
            <span>Booking Lite</span>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
