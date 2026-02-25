// tailwind.config.ts

export default {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6', 
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
    'btn-primary',
    'btn-secondary',
    'btn-accent',
    'animate-gentle-pulse',
    'animate-geometric-float',
    'text-3d',
    'hero-section',
    'view-height',
    'inner-none',
    'font-heading',
    'font-body',
    'font-soleil',
    'font-poppins',
    'font-roboto',
    'from-border-gradient-light',
    'via-border-gradient-mid',
    'to-border-gradient-dark',
    'bg-gradient-to-l',
    'bg-gradient-to-r',
    'bg-gradient-to-t',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '2.5rem',
        xl: '3rem',
        '2xl': '3.5rem',
      },
      screens: {
        sm: '40rem',
        md: '48rem',
        lg: '64rem',
        xl: '80rem',
        '2xl': '90rem',
      },
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      colors: {
        golden: {
          DEFAULT: 'oklch(var(--color-golden))',
          hover: 'oklch(var(--color-golden-hover))',
        },
        slate: {
          DEFAULT: 'oklch(var(--color-slate))',
        },
        'border-gradient': {
          light: 'oklch(var(--border-gradient-light))',
          mid: 'oklch(var(--border-gradient-mid))',
          dark: 'oklch(var(--border-gradient-dark))',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent))',
          foreground: 'oklch(var(--accent-foreground))',
        },
        background: 'oklch(var(--background))',
        border: 'oklch(var(--border) / 0.15)',
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive))',
          foreground: 'oklch(var(--destructive-foreground))',
        },
        foreground: 'oklch(var(--foreground))',
        input: 'oklch(var(--input) / 0.1)',
        muted: {
          DEFAULT: 'oklch(var(--muted))',
          foreground: 'oklch(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'oklch(var(--primary))',
          foreground: 'oklch(var(--primary-foreground))',
        },
        ring: 'oklch(var(--ring))',
        secondary: {
          DEFAULT: 'oklch(var(--secondary))',
          foreground: 'oklch(var(--secondary-foreground))',
        },
        success: 'oklch(var(--success))',
        error: 'oklch(var(--error))',
        warning: 'oklch(var(--warning))',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.foreground'),
            '--tw-prose-headings': theme('colors.foreground'),
            h1: {
              fontSize: '3.5rem',
              fontWeight: '700',
              fontFamily: theme('fontFamily.heading').join(', '),
              color: 'oklch(var(--foreground))',
            },
            h2: {
              fontFamily: theme('fontFamily.heading').join(', '),
              color: 'oklch(var(--foreground))',
            },
            h3: {
              fontFamily: theme('fontFamily.heading').join(', '),
              color: 'oklch(var(--foreground))',
            },
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              '&:hover': {
                color: 'oklch(var(--primary))',
              }
            },
            p: {
              fontFamily: theme('fontFamily.body').join(', '),
              color: 'oklch(var(--muted-foreground))',
            },
            li: {
              fontFamily: theme('fontFamily.body').join(', '),
              color: 'oklch(var(--muted-foreground))',
            },
            strong: {
              color: 'oklch(var(--primary))',
              fontWeight: '700',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': 'oklch(1 0 0)',
            '--tw-prose-headings': 'oklch(1 0 0)',
            h1: {
              color: 'oklch(1 0 0)',
            },
            h2: {
              color: 'oklch(1 0 0)',
            },
            h3: {
              color: 'oklch(1 0 0)',
            },
            p: {
              color: 'oklch(var(--muted-foreground))',
            },
            li: {
              color: 'oklch(var(--muted-foreground))',
            },
            strong: {
              color: 'oklch(var(--primary))',
            },
          },
        },
      }),
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['var(--font-body)', 'Poppins', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'Soleil', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Poppins', 'system-ui', 'sans-serif'],
        soleil: ['var(--font-heading)', 'Soleil', 'system-ui', 'sans-serif'],
        poppins: ['var(--font-body)', 'Poppins', 'system-ui', 'sans-serif'],
        roboto: ['Roboto', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'gentle-pulse': {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)' 
          },
          '50%': { 
            opacity: '0.9',
            transform: 'scale(1.02)' 
          },
        },
        'geometric-float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-8px)',
          },
        },
        'revealText': {
          '0%': {
            transform: 'translateY(50px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
      },
      animation: {
        'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
        'geometric-float': 'geometric-float 4s ease-in-out infinite',
        'revealText': 'revealText 0.6s ease-out',
      },
    },
  },
  plugins: [],
}