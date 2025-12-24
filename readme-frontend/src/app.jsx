import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import HomePage from "./pages/HomePage";
import LibrosPage from "./pages/LibrosPage";
import MisLecturasPage from "./pages/MisLecturasPage";
import LoginPage from "./pages/LoginPage";
import LibroDetallePage from "./pages/LibroDetallePage";
import EditarLecturasPage from "./pages/EditarLecturasPage";
import LecturaDetallePage from "./pages/LecturaDetallePage";
import NuevaAnotacionPage from "./pages/NuevaAnotacionPage";
import RegisterPage from "./pages/RegisterPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas con navbar + footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/libros" element={<LibrosPage />} />
          <Route path="/mis-lecturas" element={<MisLecturasPage />} />
          <Route path="/libro" element={<LibroDetallePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mis-lecturas/editar/:id" element={<EditarLecturasPage />} />
          <Route path="/mis-lecturas/:id" element={<LecturaDetallePage />} />
          <Route path="/mis-lecturas/:id/anotaciones/nueva" element={<NuevaAnotacionPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Ruta sin layout */}

      </Routes>
    </BrowserRouter>
  );
}
