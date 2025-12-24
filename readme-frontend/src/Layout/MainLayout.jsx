import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

export default function MainLayout() {
  return (
    <div className="paper-texture min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      {/* Footer opcional */}
      <footer className="border-t border-black/10 py-6 text-center text-xs text-ink/60 dark:border-white/10 dark:text-ink-muted">
        ReadMe — {new Date().getFullYear()}
      </footer>
    </div>
  );
}
