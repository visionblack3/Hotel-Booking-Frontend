import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl tracking-tightish text-ink">
          Booking Lite
        </Link>

        <nav className="flex items-center gap-7 text-sm text-stone">
          <Link to="/hotels" className="hover:text-ink transition-colors">
            All hotels
          </Link>

          {isAuthenticated && !isAdmin && (
            <Link to="/my-bookings" className="hover:text-ink transition-colors">
              My bookings
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link to="/admin" className="hover:text-ink transition-colors">
              Admin dashboard
            </Link>
          )}

          {!isAuthenticated && (
            <>
              <Link to="/login" className="hover:text-ink transition-colors">
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-none bg-ink text-paper hover:bg-moss transition-colors"
              >
                Create account
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div className="flex items-center gap-4 pl-4 border-l border-line">
              <span className="text-ink">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-stone hover:text-rust transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
