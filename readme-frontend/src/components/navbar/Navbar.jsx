import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: "#222",
        color: "white",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", color: "white" }}>
        <h2 style={{ margin: 0 }}>ReadMe</h2>
      </Link>

      <div style={{ display: "flex", gap: "20px" }}>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            color: isActive ? "#ffcc00" : "white",
            textDecoration: "none",
          })}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/libros"
          style={({ isActive }) => ({
            color: isActive ? "#ffcc00" : "white",
            textDecoration: "none",
          })}
        >
          Libros
        </NavLink>

        <NavLink
          to="/mis-lecturas"
          style={({ isActive }) => ({
            color: isActive ? "#ffcc00" : "white",
            textDecoration: "none",
          })}
        >
          Mis Lecturas
        </NavLink>

        <NavLink
          to="/login"
          style={({ isActive }) => ({
            color: isActive ? "#ffcc00" : "white",
            textDecoration: "none",
          })}
        >
          Login
        </NavLink>
      </div>
    </nav>
  );
}
