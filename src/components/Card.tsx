import { colors } from "../styles/theme";

interface Props {
  title: string;
  value: string;
}

export default function Card({ title, value }: Props) {
  return (
    <div style={{
      background: colors.white,
      borderRadius: "14px",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      minWidth: "200px"
    }}>
      <h4 style={{ color: colors.greenDark, marginBottom: "10px" }}>
        {title}
      </h4>
      <p style={{ fontSize: "26px", fontWeight: "bold" }}>
        {value}
      </p>
    </div>
  );
}
