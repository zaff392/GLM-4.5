export interface ThemeConfig {
  name: string
  colors: {
    background: string
    foreground: string
    primary: string
    'primary-foreground': string
    secondary: string
    'secondary-foreground': string
    muted: string
    'muted-foreground': string
    accent: string
    'accent-foreground': string
    destructive: string
    'destructive-foreground': string
    border: string
    input: string
    ring: string
    card: string
    'card-foreground': string
    popover: string
    'popover-foreground': string
  }
  fonts: {
    sans: string[]
    mono: string[]
  }
  borderRadius: string
}

export const themes: Record<string, ThemeConfig> = {
  sombre: {
    name: 'Sombre',
    colors: {
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
      primary: 'hsl(217.2 91.2% 59.8%)',
      'primary-foreground': 'hsl(222.2 84% 4.9%)',
      secondary: 'hsl(217.2 32.6% 17.5%)',
      'secondary-foreground': 'hsl(210 40% 98%)',
      muted: 'hsl(217.2 32.6% 17.5%)',
      'muted-foreground': 'hsl(215 20.2% 65.1%)',
      accent: 'hsl(217.2 32.6% 17.5%)',
      'accent-foreground': 'hsl(210 40% 98%)',
      destructive: 'hsl(0 62.8% 30.6%)',
      'destructive-foreground': 'hsl(210 40% 98%)',
      border: 'hsl(217.2 32.6% 17.5%)',
      input: 'hsl(217.2 32.6% 17.5%)',
      ring: 'hsl(224.3 76.3% 94.1%)',
      card: 'hsl(222.2 84% 4.9%)',
      'card-foreground': 'hsl(210 40% 98%)',
      popover: 'hsl(222.2 84% 4.9%)',
      'popover-foreground': 'hsl(210 40% 98%)',
    },
    fonts: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    borderRadius: '0.5rem',
  },
  clair: {
    name: 'Clair',
    colors: {
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      primary: 'hsl(221.2 83.2% 53.3%)',
      'primary-foreground': 'hsl(210 40% 98%)',
      secondary: 'hsl(210 40% 96%)',
      'secondary-foreground': 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(210 40% 96%)',
      'muted-foreground': 'hsl(215.4 16.3% 46.9%)',
      accent: 'hsl(210 40% 96%)',
      'accent-foreground': 'hsl(222.2 84% 4.9%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      'destructive-foreground': 'hsl(210 40% 98%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      input: 'hsl(214.3 31.8% 91.4%)',
      ring: 'hsl(221.2 83.2% 53.3%)',
      card: 'hsl(0 0% 100%)',
      'card-foreground': 'hsl(222.2 84% 4.9%)',
      popover: 'hsl(0 0% 100%)',
      'popover-foreground': 'hsl(222.2 84% 4.9%)',
    },
    fonts: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    borderRadius: '0.5rem',
  },
  cyberpunk: {
    name: 'Cyberpunk',
    colors: {
      background: 'hsl(260 20% 8%)',
      foreground: 'hsl(0 100% 100%)',
      primary: 'hsl(300 100% 50%)',
      'primary-foreground': 'hsl(0 0% 0%)',
      secondary: 'hsl(180 100% 50%)',
      'secondary-foreground': 'hsl(0 0% 0%)',
      muted: 'hsl(280 20% 15%)',
      'muted-foreground': 'hsl(0 100% 80%)',
      accent: 'hsl(120 100% 50%)',
      'accent-foreground': 'hsl(0 0% 0%)',
      destructive: 'hsl(0 100% 50%)',
      'destructive-foreground': 'hsl(0 0% 0%)',
      border: 'hsl(300 100% 50%)',
      input: 'hsl(280 20% 15%)',
      ring: 'hsl(300 100% 50%)',
      card: 'hsl(280 20% 10%)',
      'card-foreground': 'hsl(0 100% 100%)',
      popover: 'hsl(280 20% 10%)',
      'popover-foreground': 'hsl(0 100% 100%)',
    },
    fonts: {
      sans: ['Orbitron', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    borderRadius: '0.25rem',
  },
  matrix: {
    name: 'Matrix',
    colors: {
      background: 'hsl(120 100% 3%)',
      foreground: 'hsl(120 100% 80%)',
      primary: 'hsl(120 100% 50%)',
      'primary-foreground': 'hsl(120 100% 3%)',
      secondary: 'hsl(120 100% 10%)',
      'secondary-foreground': 'hsl(120 100% 80%)',
      muted: 'hsl(120 100% 8%)',
      'muted-foreground': 'hsl(120 100% 60%)',
      accent: 'hsl(120 100% 15%)',
      'accent-foreground': 'hsl(120 100% 80%)',
      destructive: 'hsl(0 100% 50%)',
      'destructive-foreground': 'hsl(120 100% 3%)',
      border: 'hsl(120 100% 20%)',
      input: 'hsl(120 100% 8%)',
      ring: 'hsl(120 100% 50%)',
      card: 'hsl(120 100% 5%)',
      'card-foreground': 'hsl(120 100% 80%)',
      popover: 'hsl(120 100% 5%)',
      'popover-foreground': 'hsl(120 100% 80%)',
    },
    fonts: {
      sans: ['Courier New', 'monospace'],
      mono: ['Fira Code', 'monospace'],
    },
    borderRadius: '0rem',
  },
}

export function getThemeCSS(themeName: string): string {
  const theme = themes[themeName]
  if (!theme) return ''

  const css = `
    :root {
      --background: ${theme.colors.background};
      --foreground: ${theme.colors.foreground};
      --primary: ${theme.colors.primary};
      --primary-foreground: ${theme.colors['primary-foreground']};
      --secondary: ${theme.colors.secondary};
      --secondary-foreground: ${theme.colors['secondary-foreground']};
      --muted: ${theme.colors.muted};
      --muted-foreground: ${theme.colors['muted-foreground']};
      --accent: ${theme.colors.accent};
      --accent-foreground: ${theme.colors['accent-foreground']};
      --destructive: ${theme.colors.destructive};
      --destructive-foreground: ${theme.colors['destructive-foreground']};
      --border: ${theme.colors.border};
      --input: ${theme.colors.input};
      --ring: ${theme.colors.ring};
      --card: ${theme.colors.card};
      --card-foreground: ${theme.colors['card-foreground']};
      --popover: ${theme.colors.popover};
      --popover-foreground: ${theme.colors['popover-foreground']};
      --radius: ${theme.borderRadius};
      --font-sans: ${theme.fonts.sans.join(', ')};
      --font-mono: ${theme.fonts.mono.join(', ')};
    }
  `
  
  return css
}