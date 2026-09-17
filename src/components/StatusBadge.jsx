const STYLES = {
  BOOKED: "text-moss border-moss",
  SUCCESS: "text-moss border-moss",
  PENDING: "text-brassDark border-brass",
  UNPAID: "text-brassDark border-brass",
  CANCELLED: "text-rust border-rust",
  FAILED: "text-rust border-rust",
};

export default function StatusBadge({ status }) {
  if (!status) return null;
  const cls = STYLES[status] || "text-stone border-line";
  return (
    <span
      className={`inline-block text-xs px-2 py-0.5 border rounded-full leading-none ${cls}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
