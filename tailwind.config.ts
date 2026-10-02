import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d10",
        surface: "#14171c",
        surface2: "#1b1f26",
        line: "#262b33",
        ink: "#e6e9ee",
        muted: "#8b93a1",
        accent: "#5b8cff",
        coin: "#f0b429",
        good: "#3fb950",
        bad: "#f85149",
      },
      maxWidth: {
        app: "30rem",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        rise: {
          "0%": { transform: "translateY(6px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        spinwheel: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(1440deg)" }
        }
      },
      animation: {
        pop: "pop 180ms ease-out",
        rise: "rise 220ms ease-out",
        spinwheel: "spinwheel 1.6s cubic-bezier(0.2, 0.8, 0.2, 1)"
      }
    },
  },
  plugins: [],
};

export default config;
