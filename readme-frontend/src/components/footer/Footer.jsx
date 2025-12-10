export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "40px",
        padding: "20px",
        textAlign: "center",
        background: "#222",
        color: "white",
      }}
    >
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} ReadMe — Desarrollado por Bere
      </p>
    </footer>
  );
}
