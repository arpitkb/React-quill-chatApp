module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "ping-slow": "ping 0.7s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        appear: {
          "0%": { filter: "opacity(0)" },
          "100%": { filter: "opacity(100)" },
        },
      },
    },
  },
  plugins: [],
};


