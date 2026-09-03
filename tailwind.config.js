/**
 * Tailwind config — a thin bridge onto the Ubatuba Stay Design System tokens.
 * Every value below points at a CSS custom property defined in src/index.css
 * (ported verbatim from ubatuba-stay-tokens.css). Do NOT hardcode new colors,
 * radii, fonts or spacing here — extend the CSS variables instead so the
 * whole app keeps a single source of truth.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: false,
  theme: {
    container: {
      center: true,
      padding: 'var(--gutter)',
    },
    screens: {
      xs: '375px',
      sm: '430px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        costa: 'var(--ub-costa)',
        mare: 'var(--ub-mare)',
        'mare-soft': 'var(--ub-mare-soft)',
        aurora: 'var(--ub-aurora)',
        concha: 'var(--ub-concha)',
        areia: 'var(--ub-areia)',
        ink: {
          950: 'var(--ink-950)',
          900: 'var(--ink-900)',
          800: 'var(--ink-800)',
          700: 'var(--ink-700)',
          600: 'var(--ink-600)',
          500: 'var(--ink-500)',
          400: 'var(--ink-400)',
          300: 'var(--ink-300)',
          200: 'var(--ink-200)',
          100: 'var(--ink-100)',
        },
        bg: {
          DEFAULT: 'var(--bg)',
          alt: 'var(--bg-alt)',
          inverse: 'var(--bg-inverse)',
          tint: 'var(--bg-tint)',
        },
        surface: 'var(--surface)',
        text: {
          DEFAULT: 'var(--text)',
          secondary: 'var(--text-secondary)',
          display: 'var(--text-display)',
          tertiary: 'var(--text-tertiary)',
          accent: 'var(--text-accent)',
        },
        inverse: {
          DEFAULT: 'var(--on-inverse)',
          link: 'var(--on-inverse-link)',
          secondary: 'var(--on-inverse-secondary)',
          muted: 'var(--on-inverse-muted)',
          label: 'var(--on-inverse-label)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
          focus: 'var(--border-focus)',
          inverse: 'var(--border-inverse)',
        },
        success: 'var(--success)',
        'success-bg': 'var(--success-bg)',
        warning: 'var(--warning)',
        'warning-bg': 'var(--warning-bg)',
        danger: 'var(--danger)',
        'danger-bg': 'var(--danger-bg)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
      },
      fontSize: {
        xs: 'var(--step--1)',
        0: 'var(--step-0)',
        1: 'var(--step-1)',
        2: 'var(--step-2)',
        3: 'var(--step-3)',
        4: 'var(--step-4)',
        5: 'var(--step-5)',
        label: 'var(--label)',
      },
      letterSpacing: {
        label: 'var(--track-label)',
        nav: 'var(--track-nav)',
        btn: 'var(--track-btn)',
      },
      lineHeight: {
        display: 'var(--lh-display)',
        heading: 'var(--lh-heading)',
        body: 'var(--lh-body)',
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        pill: 'var(--r-pill)',
        arch: 'var(--r-arch)',
      },
      boxShadow: {
        popover: 'var(--shadow-popover)',
        modal: 'var(--shadow-modal)',
      },
      transitionTimingFunction: {
        DEFAULT: 'var(--ease)',
        brand: 'var(--ease)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        DEFAULT: 'var(--dur)',
        slow: 'var(--dur-slow)',
      },
      maxWidth: {
        container: 'var(--container)',
        measure: '62ch',
      },
      spacing: {
        gutter: 'var(--gutter)',
        'section-y': 'var(--section-y)',
        nav: 'var(--nav-h)',
      },
    },
  },
  plugins: [],
};
