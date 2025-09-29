/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from "tailwind-scrollbar"

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: {
            dark: "#2196f3",
            light: "#90CAF9",
          },
          grey: {
            light: "#F0F0F0",
          },
        },
      },
    },
  },
  plugins: [
    tailwindScrollbar({
      nocompatible: true,
      preferredStrategy: "pseudoelements",
    }),
  ],
}
