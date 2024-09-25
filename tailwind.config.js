/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}', // เพิ่ม path นี้
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'), // เพิ่ม plugin นี้
  ],
};
