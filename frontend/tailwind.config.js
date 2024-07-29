/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/lib/**/*.js",
    'node_modules/flowbite-react/lib/esm/**/*.js',
    "./pages/**/*.{ts,tsx}",
    "./public/**/*.html",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF7956",
        secondary: "#00C4AE",
        tertiary: "#FFD541",
        quaternary: "#100C08",
        spaceblack:"#414A4C",

      },

    },
    fontFamily: {
      Oswald:['Oswald', 'sans-serif'],
      Josefin_Sans:['Josefin Sans', 'sans-serif'],
      Montserrat:['Montserrat', 'sans-serif'],
      Lilita_One:['Lilita One', 'sans-serif'],
      Syne:['Syne', 'sans-serif'],
      Allura:['Allura', 'cursive'],
      Glass_Antiqua:['Glass Antiqua', 'cursive'],
      Clicker_Scrip:['Clicker Script', 'cursive'],
      Style_Script:['Style Script', 'cursive'],
    },
  },
  plugins: [ require('flowbite/plugin')],
};
