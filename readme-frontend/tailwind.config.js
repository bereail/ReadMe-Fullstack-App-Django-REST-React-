/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F6F1E7", // papel
          dark: "#121212",    // carbón
        },
        ink: {
          DEFAULT: "#1A1A1A", // tinta
          soft: "#2A2A2A",
          dark: "#EDE7DD",    // tinta en dark (off-white)
          muted: "#B8B2AA",
        },
        accent: {
          DEFAULT: "#FFC400", // amarillo editorial
          red: "#E03A2A",
        },
      },
      boxShadow: {
        paper: "0 10px 30px rgba(0,0,0,0.08)",
        paperDark: "0 10px 30px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        card: "18px",
      },
    },
  },
  plugins: [],
};
