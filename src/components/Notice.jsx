export default function Notice({ type = "error", children }) {
  if (!children) return null;
  const styles =
    type === "error"
      ? "border-rust/40 bg-rust/5 text-rust"
      : type === "success"
      ? "border-moss/40 bg-moss/5 text-moss"
      : "border-line bg-paperDim text-stone";

  return (
    <div className={`border px-4 py-3 text-sm ${styles}`} role="status">
      {children}
    </div>
  );
}
