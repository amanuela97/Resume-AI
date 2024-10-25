import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        success: "#10B981", // Green
        error: "#EF4444", // Red
        background: "hsl(var(--background))", // Ensure this is defined
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        'button-bg': 'hsl(var(--button-background) / <alpha-value>)',
        'button-hover': 'hsl(var(--button-hover) / <alpha-value>)',
        'button-active': 'hsl(var(--button-active) / <alpha-value>)',
        'button-text': 'hsl(var(--button-text) / <alpha-value>)',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
};

export default config;
