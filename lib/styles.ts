export const colors = {
  orange: "#F97316",
  orangeDark: "#EA580C",
  black: "#1a1a1a",
  white: "#ffffff",
  bgLight: "#f5f5f5",
  border: "#e5e5e5",
  error: "#dc2626",
  errorBg: "#fef2f2",
  errorBorder: "#fca5a5",
};

export const btnOrange: React.CSSProperties = {
  backgroundColor: colors.orange,
  color: colors.white,
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "15px",
  padding: "14px",
  width: "100%",
};

export const btnBack: React.CSSProperties = {
  backgroundColor: colors.white,
  color: colors.black,
  border: `2px solid ${colors.border}`,
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "15px",
  padding: "14px",
  width: "100%",
};

export const card: React.CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: "16px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  padding: "28px",
};

export const input: React.CSSProperties = {
  border: `2px solid ${colors.border}`,
  borderRadius: "8px",
  padding: "10px 16px",
  fontSize: "16px",
  outline: "none",
  color: colors.black,
  width: "100%",
};

export const label: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
  color: colors.black,
  fontWeight: "600",
  marginBottom: "8px",
};

export const stepTitle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "bold",
  color: colors.black,
  marginBottom: "20px",
};

export const errorBox: React.CSSProperties = {
  backgroundColor: colors.errorBg,
  border: `1px solid ${colors.errorBorder}`,
  color: colors.error,
  borderRadius: "8px",
  padding: "12px 16px",
  marginBottom: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
