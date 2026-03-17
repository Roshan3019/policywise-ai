export default function LoadingSpinner({ size = 40, label = "Loading..." }: { size?: number; label?: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "48px",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "3px solid var(--glass-border)",
          borderTopColor: "var(--accent-blue)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      {label && (
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{label}</p>
      )}
    </div>
  );
}
