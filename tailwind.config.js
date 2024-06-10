/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      colors: {
        primary: "#3498db",
        secondary: "#e74c3c",
        // Thêm các màu sắc khác nếu cần
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
