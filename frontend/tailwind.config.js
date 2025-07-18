/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // very important
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                'pop-in': {
                    '0%': { opacity: 0, transform: 'scale(0.95)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                },
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.3s ease-out both',
                'pop-in': 'pop-in 0.3s ease-out both',
            },
        },
    },
    plugins: [],
}

