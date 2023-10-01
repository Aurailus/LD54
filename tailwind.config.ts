/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx,ts,jsx}"],
  theme: {
    extend: {
			spacing: {
				'128': '32rem',
			},
      fontFamily: {
        'handwritten': [ '"Darumadrop One"' ],
        'mono': [ '"Space Mono"' ]
      },
      animation: {
        'part-moving': 'part-moving 0.075s ease-out 1 forwards',
        'text-bob': 'text-bob 1s ease-in-out calc(-100s + var(--i) * 0.1s) infinite',
        'text-wobble': 'text-wobble 0.3s linear calc(-100s + var(--i) * 0.1s) infinite',
        'text-scale': 'text-scale 1s ease-in-out calc(-100s + var(--i) * 0.1s) infinite',
        'letter-in': 'letter-in 0.1s cubic-bezier(0.5, 0.04, 0.6, 1.4) 1 forwards',
        'text-skip': 'text-skip 0.4s ease-in-out 1',
        'text-next': 'text-next 0.175s ease-in-out 1',
        'message-in': 'message-in 0.2s ease-out 1 forwards',
        'message-out': 'message-out 0.15s ease-in 1 forwards',
        'slide-in': 'slide-in 0.5s ease 1 forwards',
        'slide-in-fast': 'slide-in-fast 0.3s ease 1 forwards',
        'slide-out': 'slide-out 0.2s ease 1 forwards',
        'ringing': 'ringing 0.5s linear infinite'
      },
      keyframes: {
        'letter-in': {
          'from': { transform: 'scale(0%)' },
          'to': { transform: 'scale(100%)' }
        },
        'part-moving': {
          'from': { transform: 'scale(100%)' },
          'to': { transform: 'scale(80%)' }
        },
        'text-bob': {
          'from': { transform: 'translateY(-1px)' },
          '50%': { transform: 'translateY(1px)' },
          'to': { transform: 'translateY(-1px)' }
        },
        'text-wobble': {
          '0%': { transform: 'translate(-0.33px, -0.16px)' },
          '10%': { transform: 'translate(0.16px, 0.33px)' },
          '20%': { transform: 'translate(-0.33px, 0.16px)' },
          '30%': { transform: 'translate(-0.16px, -0.33px)' },
          '40%': { transform: 'translate(-0.16px, 0.33px)' },
          '50%': { transform: 'translate(-0.16px, -0.33px)' },
          '60%': { transform: 'translate(-0.33px, -0.16px)' },
          '70%': { transform: 'translate(0.16px, -0.33px)' },
          '80%': { transform: 'translate(0.16px, 0.33px)' },
          '90%': { transform: 'translate(0.16px, -0.33px)' },
          '100%': { transform: 'translate(-0.33px, -0.16px)' },
        },
        'text-scale': {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(0.8)' }
        },
        'text-skip': {
          '0%': { transform: 'translateX(0px)' },
          '10%': { transform: 'translateX(8px)' },
          '20%': { transform: 'translateX(-7px)' },
          '30%': { transform: 'translateX(5px)' },
          '40%': { transform: 'translateX(-4px)' },
          '50%': { transform: 'translateX(2px)' },
          '60%': { transform: 'translateX(-1px)' },
          '70%': { transform: 'translateX(0px)' }
        },
        'text-next': {
          'from': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(0.85)', opacity: 0.8 },
          'to': { transform: 'scale(1)', opacity: 1 }
        },
        'message-in': {
          'from': { transform: 'scale(70%)', opacity: 0 },
          'to': { transform: 'scale(100%)', opacity: 1 }
        },
        'message-out': {
          'from': { transform: 'scale(100%)', opacity: 1 },
          'to': { transform: 'scale(70%)', opacity: 0 }
        },
        'slide-in': {
          'from': { opacity: 0, transform: 'translateY(40px)' },
          'to': { opacity: 1, transform: 'translateY(0px)' },
        },
        'slide-in-fast': {
          'from': { opacity: 0, transform: 'translateY(20px)' },
          'to': { opacity: 1, transform: 'translateY(0px)' },
        },
        'slide-out': {
          'from': { opacity: 1, transform: 'translateY(0px)' },
          'to': { opacity: 0, transform: 'translateY(20px)' },
        },
        'ringing': {
          'from': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(0px)' },
          '50.1%': { transform: 'translateY(-5px) rotate(10deg)' },
          '75%': { transform: 'translateY(-5px) rotate(10deg)' },
          '75.1%': { transform: 'translateY(-3px) rotate(-10deg)' },
          '99%': { transform: 'translateY(-3px) rotate(-10deg)' },
          '99.1%': { transform: 'translateY(0px)' },
        }
      }
		},
  },
  plugins: [],
}
