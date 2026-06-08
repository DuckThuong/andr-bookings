/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./modules/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{js,jsx,ts,tsx}",
    "./providers/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DMSans"],
        medium: ["DMSans-Medium"],
        semibold: ["DMSans-SemiBold"],
        bold: ["DMSans-Bold"],
      },
      colors: {
        text_color_1: "#00293a",
        text_color_2: "#f0f2f5",
        text_color_3: "#147ba7",
        text_color_4: "#015e86a1",

        black_color: "#00293a",
        white_color: "#ffffff",
        primary_color: "#00293a",
        secondary_color: "#00609c",

        text_alert_1: "#e52500",
        text_alert_2: "#007bff",

        color_text_primary: "#333333",
        color_border: "#d9d9d9",
        color_blue_5: "#1890ff",
        color_blue_4: "#40a9ff",
        color_blue_6: "#096dd9",
        color_red_5: "#ff4d4f",
        color_orange_5: "#faad14",
        color_gray_2: "#f5f5f5",
        color_gray_6: "#bfbfbf",
        color_white: "#ffffff",

        shadow_focus_blue: "rgba(24, 144, 255, 0.2)",
        shadow_error_red: "rgba(255, 77, 79, 0.2)",
        shadow_warning_orange: "rgba(250, 173, 20, 0.2)",

        background_color: "#f7f8f9",
        background_color_1: "#6ba7e44b",
      },
    },
  },
  plugins: [],
};
