/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0E0F12",
        surface: "#191B1F",
        border: "#26282E",
        ink: "#F2F0EB",
        muted: "#8A8E96",
        faint: "#6B6F76",
        orange: "#FF4D2E",
        blue: "#2E6BFF",
        purple: "#C77DFF",
        green: "#22C55E",
        flame: "#FF9F1C",
      },
      fontFamily: {
        display: ["'Archivo Black'", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
