import { JetBrains_Mono, Lato, Lora, Noto_Sans, Noto_Sans_Armenian, Noto_Serif_Armenian } from 'next/font/google';

// Self-hosted at build time by next/font (WOFF2, unicode-range subsets, font-display: swap).
export const lora = Lora({ subsets: ['latin', 'latin-ext', 'cyrillic'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--font-lora', display: 'swap' });
export const lato = Lato({ subsets: ['latin', 'latin-ext'], weight: ['400', '700'], variable: '--font-lato', display: 'swap' });
// Lato has no Cyrillic: Russian falls through to Noto Sans glyph by glyph.
export const notoSans = Noto_Sans({ subsets: ['cyrillic', 'cyrillic-ext'], weight: ['400', '700'], variable: '--font-noto-sans', display: 'swap', preload: false });
export const notoSansArm = Noto_Sans_Armenian({ subsets: ['armenian'], weight: ['400', '700'], variable: '--font-noto-sans-arm', display: 'swap', preload: false });
export const notoSerifArm = Noto_Serif_Armenian({ subsets: ['armenian'], weight: ['400', '500'], variable: '--font-noto-serif-arm', display: 'swap', preload: false });
export const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-mono', display: 'swap', preload: false });

export const fontVars = [lora, lato, notoSans, notoSansArm, notoSerifArm, mono].map((f) => f.variable).join(' ');
