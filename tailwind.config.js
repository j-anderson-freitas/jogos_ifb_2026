/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 Dynamic IFB Palette
        m3: {
          // Primary (IFB Green)
          primary: {
            DEFAULT: '#007A33',
            dark: '#67DC7A',
            container: '#C2F3C8',
            'container-dark': '#005320',
            'on-container': '#002108',
            'on-container-dark': '#C2F3C8',
          },
          // Secondary (IFB Forest Teal)
          secondary: {
            DEFAULT: '#4E6352',
            dark: '#B5CCB8',
            container: '#D1E8D3',
            'container-dark': '#374B3B',
          },
          // Tertiary (IFB Red Alert / Live Pulse)
          tertiary: {
            DEFAULT: '#C92A2A',
            dark: '#FFB3B3',
            container: '#FFDAD9',
            'container-dark': '#731115',
          },
          // Surfaces (Light & Dark M3)
          surface: {
            DEFAULT: '#F8FAF6',
            dark: '#111411',
            dim: '#D8DBD5',
            'dim-dark': '#111411',
            bright: '#F8FAF6',
            'bright-dark': '#373A36',
            container: {
              lowest: '#FFFFFF',
              'lowest-dark': '#0C0F0D',
              low: '#F2F5F0',
              'low-dark': '#191D1A',
              DEFAULT: '#ECEFEA',
              dark: '#1D211E',
              high: '#E6EAE5',
              'high-dark': '#282B28',
              highest: '#E1E4DF',
              'highest-dark': '#323632',
            }
          },
          outline: {
            DEFAULT: '#727971',
            dark: '#8C938A',
            variant: '#C2C9C0',
            'variant-dark': '#424941',
          }
        }
      },
      borderRadius: {
        'm3-xs': '4px',
        'm3-sm': '8px',
        'm3-md': '12px',
        'm3-lg': '16px',
        'm3-xl': '28px',
        'm3-full': '9999px',
      },
      boxShadow: {
        'm3-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        'm3-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        'm3-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)',
        'm3-4': '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.30)',
      }
    },
  },
  plugins: [],
}

