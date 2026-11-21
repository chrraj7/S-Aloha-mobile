/** Native equivalents of the visual tokens in S-Aloha frontend/src/styles.css. */
export const colors = {
  app: '#070d1a',
  surface: '#0d1729',
  surfaceRaised: '#13213b',
  surfaceHover: '#1a2c4d',
  nav: '#050a14',
  text: '#f2f4f8',
  secondary: '#aeb6c8',
  tertiary: '#8a95ad',
  disabled: '#4d5873',
  border: '#223658',
  borderSubtle: '#16243f',
  borderStrong: '#4a66a3',
  focus: '#a8f5e2',
  accentBlue: '#4aa8ff',
  accentBlueSoft: '#102542',
  accentTeal: '#2fe0b5',
  accentTealSoft: '#0b2a28',
  accentEmerald: '#4bd37b',
  accentAmber: '#ffad4a',
  accentAmberSoft: '#2d1d0b',
  accentRed: '#ff6b5f',
  accentRedSoft: '#2e1215',
  accentViolet: '#b794f6',
  brandNavy: '#070d1a',
  brandNavyDeep: '#050a14',
  brandBlue: '#4aa8ff',
  brandTeal: '#2fe0b5',
  white: '#ffffff',
} as const;

export const radius = { badge: 3, control: 6, card: 10, panel: 14 } as const;
export const typography = {
  // Geologica and IBM Plex are the parent app's display and body faces. The
  // parent ships WOFF2 assets; native builds use platform sans until native
  // font files are added, while preserving the font-weight hierarchy.
  display: 'Geologica',
  body: 'IBM Plex Sans',
  mono: 'IBM Plex Mono',
} as const;
