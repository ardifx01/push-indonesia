/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // <- perlu untuk toggle dark mode
    content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './pages/**/*.{js,ts,jsx,tsx,mdx}', // opsional kalau kamu pakai /pages
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  