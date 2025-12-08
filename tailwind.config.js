/** @type {import('tailwindcss').Config} */

import twGlow from "twglow";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Background
        background: "#2c2c2c",
        "background-deeper": "#1f1f1f",
        "background-subtle": "#444444",
        
        // Borders
        border: "#3a3a3a4d",
        "app-border": "#3a3a3a4d",
        
        // Buttons
        button: "#2c2c2c",
        "button-border": "#3a3a3a4d",
        
        // Primary
        primary: "#313131",
        "primary-border": "#313131",
        
        // Text
        text: "#e0e0e0",
        "text-muted": "#b0b0b0",
        icon: "#b0b0b0",
        
        // Feedback
        success: "#868e79",
        danger: "#a55a5a",
        warning: "#b38b6d"
      },
      fontFamily: {
        mono: ["Geist Mono", "monospace"],
      },
    },
  },
  plugins: [twGlow],
}