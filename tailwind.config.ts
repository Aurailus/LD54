/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx,ts,jsx}"],
  theme: {
    extend: {
			spacing: {
				'128': '32rem',
			},
      fontFamily: {
      },
      animation: {
        'part-moving': 'part-moving 0.075s ease-out 1 forwards'
      },
      keyframes: {
        'part-moving': {
          'from': { transform: 'scale(100%)' },
          'to': { transform: 'scale(80%)' }
        }
      }
		},
  },
  plugins: [],
}
