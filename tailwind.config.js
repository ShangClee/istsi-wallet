/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        glowing: {
          "0%": { filter: "drop-shadow(0 0 30px #ffffff)" },
          "50%": { filter: "drop-shadow(0 0 0px #ffffff)" },
          "100%": { filter: "drop-shadow(0 0 30px #ffffff)" }
        }
      },
      animation: {
        glowing: "glowing 5000ms infinite"
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(to left bottom, #01B3F3, #0176DC)"
      },
      colors: {
        brand: {
          dark: "#0290c0",
          main: "#02b8f5",
          main15: "#02b8f526",
          light: "#72dbfe"
        },
        warning: "#ffc107" // amber-500
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".mask-gradient": {
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 5%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0.3) 95%, rgba(0, 0, 0, 0) 100%)",
        },
        ".mask-gradient-left": {
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 5%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0.3) 95%, rgba(0, 0, 0, 0) 100%)",
          WebkitMaskPositionX: "0",
          WebkitMaskSize: "110%",
        },
        ".mask-gradient-right": {
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 5%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0.3) 95%, rgba(0, 0, 0, 0) 100%)",
          WebkitMaskPositionX: "-10vw",
          WebkitMaskSize: "110%",
        },
        ".mask-gradient-both": {
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 5%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0.3) 95%, rgba(0, 0, 0, 0) 100%)",
          WebkitMaskPositionX: "0",
          WebkitMaskSize: "100%",
        },
      })
    },
  ],
}

