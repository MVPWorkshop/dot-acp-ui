/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "unbounded-variable": ["UnboundedVariable", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        pink: "#E6007A",
        purple: {
          400: "#6D3AEE",
          500: "#6D3AEE",
          600: "#442299",
        },
        cyan: {
          500: "#00B2FF",
          600: "#00A6ED",
          700: "#0094D4",
        },
        green: {
          500: "#56F39A",
          600: "#51E591",
          700: "#48CC81",
        },
        lime: {
          500: "#D3FF33",
          600: "#BEE52E",
          700: "#A9CC29",
        },
        purpleDark: {
          700: "#321D47",
          800: "#28123E",
          900: "#1C0533",
          925: "#160527",
          950: "#140523",
        },
        purpleLight: {
          50: "#FBFCFE",
          100: "#F3F5FB",
          200: "#E6EAF6",
          300: "#DAE0F2",
        },
        textColor: {
          "header-light": "#000000E5",
          "body-light": "#000000B2",
          "label-light": "#00000080",
          "disabled-light": "#00000059",
          "header-dark": "#FFFFFFE5",
          "body-dark": "#FFFFFFB2",
          "label-dark": "#FFFFFF80",
          "disabled-dark": "#FFFFFF59",
        },
      },
      fontSize: {
        "heading-1": "48px",
        "heading-2": "40px",
        "heading-3": "33px",
        "heading-4": "28px",
        "heading-5": "23px",
        "heading-6": "19px",
        large: "16px",
        medium: "13px",
        small: "11px",
      },
    },
  },
  plugins: [],
};
