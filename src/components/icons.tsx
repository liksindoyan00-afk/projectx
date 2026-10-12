import type { CSSProperties } from 'react';

export const STAR_PATH = 'M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z';

export function Star({ size = 12, color = '#B99A5A', style, label }: { size?: number; color?: string; style?: CSSProperties; label?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: 'none', ...style }} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}>
      <path d={STAR_PATH} fill={color} />
    </svg>
  );
}

export function StarRule({ size = 12 }: { size?: number }) {
  return (
    <div className="star-rule" aria-hidden="true">
      <span />
      <Star size={size} />
      <span />
    </div>
  );
}

type IconProps = { size?: number; color?: string };

export const MailIcon = ({ size = 18, color = '#B99A5A' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: 'none' }}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" fill="none" stroke={color} strokeWidth="1.5" />
    <path d="M3.5 6l8.5 7 8.5-7" fill="none" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const TelegramIcon = ({ size = 18, color = '#B99A5A' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: 'none' }}>
    <path d="M21 4L3 11l6 2 2 6 3-4 5 4z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const ChatIcon = ({ size = 18, color = '#B99A5A' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: 'none' }}>
    <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const PhoneIcon = ({ size = 18, color = '#B99A5A' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: 'none' }}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2" fill="none" stroke={color} strokeWidth="1.5" />
    <path d="M10.5 18.5h3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const InstagramIcon = ({ size = 18, color = '#B99A5A' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: 'none' }}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke={color} strokeWidth="1.5" />
    <circle cx="12" cy="12" r="4" fill="none" stroke={color} strokeWidth="1.5" />
    <circle cx="17.2" cy="6.8" r="1.1" fill={color} />
  </svg>
);

/** Decorative gold hairline arc with an optional star at its end. Coordinates are in the viewBox. */
export function Arc({
  viewBox,
  d,
  opacity = 0.35,
  star,
  aspect = 'xMaxYMax slice',
  extra,
}: {
  viewBox: string;
  d: string;
  opacity?: number;
  star?: string; // transform for the star, e.g. "translate(1138 56)"
  aspect?: string;
  extra?: React.ReactNode;
}) {
  return (
    <svg className="arc" viewBox={viewBox} preserveAspectRatio={aspect} aria-hidden="true">
      <path d={d} fill="none" stroke="#B99A5A" strokeOpacity={opacity} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {extra}
      {star && <path transform={star} d={STAR_PATH} fill="#B99A5A" />}
    </svg>
  );
}

/** Arc confined to the top band of a hero (fixed height so it does not stretch with content). */
export function TopArc({ height, viewBox, d, star, opacity = 0.3 }: { height: number; viewBox: string; d: string; star?: string; opacity?: number }) {
  return (
    <div className="arc-top" style={{ height }} aria-hidden="true">
      <svg viewBox={viewBox} preserveAspectRatio="xMaxYMin slice">
        <path d={d} fill="none" stroke="#B99A5A" strokeOpacity={opacity} strokeWidth="1" />
        {star && <path transform={star} d={STAR_PATH} fill="#B99A5A" />}
      </svg>
    </div>
  );
}
