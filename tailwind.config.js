/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./frontend/**/*.{html,js}"],
    theme: {
        extend: {},
    },
    plugins: [
        require('daisyui'),
    ],
    daisyui: {
        themes: [
            "coffee", "retro"
        ]
    },
}