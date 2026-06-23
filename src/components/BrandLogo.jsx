export default function BrandLogo({ variant = "dark", className = "" }) {
  const loonClass = variant === "dark" ? "text-white" : "text-navy";

  return (
    <span className={`font-extrabold tracking-tight ${className}`}>
      <span className={loonClass}>Loon</span>
      <span className="text-amber">transparant</span>
    </span>
  );
}
