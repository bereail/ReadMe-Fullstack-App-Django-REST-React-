import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import HomePage from "./pages/HomePage";
import LibrosPage from "./pages/LibrosPage";
import MisLecturasPage from "./pages/MisLecturasPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas con navbar + footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/libros" element={<LibrosPage />} />
          <Route path="/mis-lecturas" element={<MisLecturasPage />} />
                  <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Ruta sin layout */}

      </Routes>
    </BrowserRouter>
  );
}
