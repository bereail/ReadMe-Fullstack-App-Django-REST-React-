// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MyReadingsPage from "./pages/MyReadingsPage";
import ReadingDetailPage from "./pages/ReadingDetailPage";
import { AuthProvider } from "./api/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mis-lecturas" element={<MyReadingsPage />} />
          <Route path="/lecturas/:id" element={<ReadingDetailPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
