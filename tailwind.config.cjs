/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
        accent: "var(--accent)",
        fondo: "var(--background)",
        neutral: "#ffffff",
        darkNavBg: "#3b3b3b",
        darkNavText: "#f5f5f5",
        primaryHover: "#A8D7E6",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        base: "4px",
      },
    },
  },
  plugins: [],
};
