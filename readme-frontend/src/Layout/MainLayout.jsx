import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar />

      <main style={{ minHeight: "80vh", padding: "20px" }}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
