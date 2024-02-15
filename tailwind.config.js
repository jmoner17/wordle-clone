/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      minHeight: {
        '915': '57.188rem',
        '835': '52.188rem',
        '12': '14.875rem',
      },
      zIndex: {
        '-50': '-50',
        'top': '90',
      },
      minWidth: {
        'sideWidth': '20.313rem',
      },
      width: {
        'big': '56.25rem',
      },
      height: {
        'tiny': '0.125rem',
      },
      backgroundColor: {
        'theme-color': 'var(--theme-color)',
        'primary': 'var(--primary-color)',
        'secondary': 'var(--secondary-color)',
        'accent': 'var(--accent-color)',
        'dark-primary': 'var(--dark-primary-color)',
        'dark-secondary': 'var(--dark-secondary-color)',
        'dark-accent': 'var(--dark-accent-color)',
        'dark-light-bg-color': 'var(--dark-light-bg-color)',
        'light-bg-color': 'var(--light-bg-color)',
      },
      textColor: {
        'theme-color': 'var(--theme-color)',
        'text-color': 'var(--text-color)',
        'light-text': 'var(--light-text-color)',
        'dark-text-color': 'var(--dark-text-color)',
        'dark-light-text': 'var(--dark-light-text-color)',
        'accent': 'var(--accent-color)',
        'dark-accent': 'var(--dark-accent-color)',
      },
      borderColor: {
        'theme-color': 'var(--theme-color)',
        'accent': 'var(--accent-color)',
        'dark-accent': 'var(--dark-accent-color)',
        'primary': 'var(--primary-color)',
        'dark-primary': 'var(--dark-primary-color)',
        'text-color': 'var(--text-color)',
        'dark-text-color': 'var(--dark-text-color)',
      },

      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'fade-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in-right': 'fade-in-right 0.5s ease-out',
        'fade-in-down': 'fade-in-down 0.5s ease-out'
      },
    },
  },
  plugins: [],
}

