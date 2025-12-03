import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Populares from "./pages/Populares";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/populares" element={<Populares />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
