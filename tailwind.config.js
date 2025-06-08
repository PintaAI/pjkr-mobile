const { hairlineWidth, fontScale } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        fail: {
          DEFAULT: 'hsl(var(--fail))',
          foreground: 'hsl(var(--fail-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      boxShadow: {
        'sm': '0px 0px 1px 0 rgb(0 0 0 / 0.2)',
        'DEFAULT': '1px 1px 2px 0 rgb(0 0 0 / 0.25)',
        'md': '2px 2px 3px 0 rgb(0 0 0 / 0.3)',
        'lg': '3px 3px 4px 0 rgb(0 0 0 / 0.35)',
        'xl': '4px 4px 6px 0 rgb(0 0 0 / 0.4)',
        '2xl': '5px 5px 8px 0 rgb(0 0 0 / 0.45)',
        'inner': 'inset 0px 0px 2px 0 rgb(0 0 0 / 0.2)',
        'primary': '2px 2px 3px 0 rgb(var(--primary) / 0.6)',
        'secondary': '2px 2px 3px 0 rgb(var(--secondary) / 0.6)',
        'accent': '2px 2px 3px 0 rgb(var(--accent) / 0.6)',
        'none': '0 0 #0000',
      },
      elevation: {
        'sm': 2,
        'DEFAULT': 4,
        'md': 8,
        'lg': 12,
        'xl': 16,
        '2xl': 24,
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        'sans': 'var(--font-sans)',
        'serif': 'var(--font-serif)',
        'mono': 'var(--font-mono)',
      },
      fontSize: {
        'xs': fontScale(12),
        'sm': fontScale(14),
        'base': fontScale(16),
        'lg': fontScale(18),
        'xl': fontScale(20),
        '2xl': fontScale(24),
        '3xl': fontScale(30),
        '4xl': fontScale(36),
        '5xl': fontScale(48),
        '6xl': fontScale(60),
        '7xl': fontScale(72),
        '8xl': fontScale(96),
        '9xl': fontScale(128),
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
