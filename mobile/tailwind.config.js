/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8b5cf6",
          dark: "#7c3aed",
          light: "#a78bfa",
        },
        secondary: "#ec4899",
        accent: "#f59e0b",
        success: "#10b981",
        warning: "#f43f5e",
        bg: {
          dark: "#020617",
        },
        surface: {
          dark: "#0f172a",
        },
        border: {
          dark: "#1e293b",
        }
      },
      fontFamily: {
        inter: ["Inter"],
        outfit: ["Outfit"],
      }
    },
  },
  plugins: [],
};
