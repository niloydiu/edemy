/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030014",
        cardBg: "rgba(255, 255, 255, 0.03)",
        borderColor: "rgba(255, 255, 255, 0.08)",
        neonCyan: "#00f2fe",
        neonPurple: "#4facfe",
        neonMagenta: "#f35588",
      },
      boxShadow: {
        neon: "0 0 15px rgba(0, 242, 254, 0.5)",
        neonPurple: "0 0 15px rgba(79, 172, 254, 0.5)",
        neonMagenta: "0 0 15px rgba(243, 85, 136, 0.5)",
      },
    },
  },
  plugins: [],
}
