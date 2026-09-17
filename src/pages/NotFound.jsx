import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-32 text-center">
      <p className="text-brassDark text-sm mb-2">404</p>
      <h1 className="font-display text-3xl text-ink mb-4">Page not found</h1>
      <p className="text-stone text-sm mb-8">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="inline-block bg-ink text-paper px-6 py-3 hover:bg-moss transition-colors"
      >
        Back home
      </Link>
    </div>
  );
}
