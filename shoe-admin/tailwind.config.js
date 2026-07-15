/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Quicksand', 'sans-serif'],
            },
            colors: {
                primary: '#4F46E5', // Màu chủ đạo
            }
        },
    },
    plugins: [],
}