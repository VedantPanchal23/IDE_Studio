/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* white-10 */
        input: "var(--color-input)", /* charcoal-lighter */
        ring: "var(--color-ring)", /* vs-code-blue */
        background: "var(--color-background)", /* deep-charcoal */
        foreground: "var(--color-foreground)", /* light-gray */
        surface: {
          DEFAULT: "var(--color-surface)", /* charcoal-light */
          foreground: "var(--color-surface-foreground)", /* light-gray */
        },
        primary: {
          DEFAULT: "var(--color-primary)", /* vs-code-blue */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* neutral-gray */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red-500 */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* gray-700 */
          foreground: "var(--color-muted-foreground)", /* gray-400 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* warm-orange */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* charcoal-lighter */
          foreground: "var(--color-popover-foreground)", /* light-gray */
        },
        card: {
          DEFAULT: "var(--color-card)", /* charcoal-light */
          foreground: "var(--color-card-foreground)", /* light-gray */
        },
        success: {
          DEFAULT: "var(--color-success)", /* green-500 */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber-500 */
          foreground: "var(--color-warning-foreground)", /* black */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red-500 */
          foreground: "var(--color-error-foreground)", /* white */
        },
        panel: {
          DEFAULT: "var(--color-panel)", /* charcoal-lighter */
          foreground: "var(--color-panel-foreground)", /* light-gray */
          border: "var(--color-panel-border)", /* white-8 */
        },
        hover: {
          DEFAULT: "var(--color-hover)", /* white-5 */
          strong: "var(--color-hover-strong)", /* white-10 */
        },
        active: {
          DEFAULT: "var(--color-active)", /* vs-code-blue-20 */
          foreground: "var(--color-active-foreground)", /* light-gray */
        },
        focus: {
          DEFAULT: "var(--color-focus)", /* vs-code-blue */
          ring: "var(--color-focus-ring)", /* vs-code-blue-30 */
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)", /* 8px */
        md: "var(--radius-md)", /* 6px */
        sm: "var(--radius-sm)", /* 4px */
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      boxShadow: {
        'resting': 'var(--shadow-resting)',
        'raised': 'var(--shadow-raised)',
        'floating': 'var(--shadow-floating)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'ide': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in": "slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}