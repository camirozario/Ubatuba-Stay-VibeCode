import { cn } from '../../utils/cn';

const FULL_VIEWBOX = '0 0 489.04 489.04';
const MARK_VIEWBOX = '118 128 252 184';
const FULL_WORDMARK_FONT_SIZE = 25.86;
const LINE_PATH =
  'M256.23,275.85l5.52,5.68c12.21,11.34,28.04,17.93,44.77,18.24,6.03.11,11.6-.43,17.29-2.32,6.97-2.32,13.24-6.37,17.57-12.38,6.57-9.12,7.1-20.93,4.11-27.03-2.99-6.1-5.75-11.02-20.79-23.01-15.05-11.99-17.83-29.23-2.73-43.07,15.09-13.83,29.27-5.64,30.64-4.88,1.37.75,7.8,5.9,9.97,10.41-.12.53.42.88.51.3,3.25-10.23,3.67-21.12-3.09-29.5-8.24-10.21-22.21-13.06-34.9-11.82-23.43,2.3-44.12,15.5-60.88,31.42-7.06,6.7-13.49,13.71-19.47,21.39l-17.64,22.65-16.65,22.17-17.62,21.76c-3.86,4.77-8.32,8.69-13.18,12.4-10.93,8.35-24.89,11.36-37.72,6.09-11.4-4.68-18.13-15.68-17.35-28.01.36-5.68,1.98-10.91,4.44-16.09l9.75-17.57c5.03-9.06,15.11-25.59,11.5-35.21';
const SUN_PATH =
  'M257.98,181.07c13.69-12.97,27.77-22.28,42.09-27.89-4.37-11.69-16.65-18.85-29.29-16.35-14.05,2.78-23.18,16.43-20.4,30.48,1.08,5.48,3.83,10.19,7.6,13.76Z';

function getInkStyle(inverse, inkColor) {
  if (inkColor === null) return undefined;

  return {
    color: inkColor ?? (inverse ? 'rgba(247,243,236,0.92)' : 'var(--ub-costa)'),
  };
}

function getSunColor(inverse, sunColor) {
  if (sunColor === null) return 'currentColor';
  return sunColor ?? (inverse ? 'currentColor' : 'var(--ub-mare)');
}

function BrandSvg({ viewBox, animateOnMount = false, className = '', children, inverse = true, inkColor }) {
  return (
    <svg
      viewBox={viewBox}
      className={cn('brand-logo', animateOnMount && 'brand-logo--animated', className)}
      style={getInkStyle(inverse, inkColor)}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function BrandMark({
  inverse = true,
  animateOnMount = false,
  className = '',
  inkColor,
  sunColor,
}) {
  return (
    <BrandSvg
      viewBox={MARK_VIEWBOX}
      animateOnMount={animateOnMount}
      className={cn('brand-mark', className)}
      inverse={inverse}
      inkColor={inkColor}
    >
      <path
        className="brand-logo__line"
        d={LINE_PATH}
        pathLength="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeMiterlimit="10"
      />
      <path className="brand-logo__sun" d={SUN_PATH} fill={getSunColor(inverse, sunColor)} />
    </BrandSvg>
  );
}

export function BrandWordmark({ inverse = true, className = '', inkColor }) {
  return (
    <span className={cn('brand-wordmark', className)} style={getInkStyle(inverse, inkColor)} aria-hidden="true">
      <span className="brand-wordmark__hair">UBATUBA</span>
      <span className="brand-wordmark__regular">STAY</span>
    </span>
  );
}

export function BrandLockup({
  inverse = true,
  className = '',
  markClassName = '',
  wordmarkClassName = '',
  markRef = null,
  inkColor,
  sunColor,
}) {
  return (
    <span className={cn('brand-lockup', className)} style={getInkStyle(inverse, inkColor)}>
      <span ref={markRef} className={cn('brand-lockup__mark', markClassName)}>
        <BrandMark inverse={inverse} inkColor={null} sunColor={sunColor} className="w-full" />
      </span>
      <BrandWordmark inverse={inverse} inkColor={null} className={wordmarkClassName} />
    </span>
  );
}

export function Logo({
  inverse = true,
  animateOnMount = false,
  className = '',
  inkColor,
  sunColor,
  compactWordmark = false,
}) {
  const wordmarkProps = compactWordmark
    ? {
        x: 124,
        y: 346.16,
        fontSize: 28.15,
        textLength: 240,
        lengthAdjust: 'spacingAndGlyphs',
      }
    : {
        transform: 'translate(123.68 346.16)',
        fontSize: FULL_WORDMARK_FONT_SIZE,
      };

  return (
    <BrandSvg
      viewBox={FULL_VIEWBOX}
      animateOnMount={animateOnMount}
      className={className}
      inverse={inverse}
      inkColor={inkColor}
    >
      <g>
        <path
          className="brand-logo__line"
          d={LINE_PATH}
          pathLength="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeMiterlimit="10"
        />
        <path className="brand-logo__sun" d={SUN_PATH} fill={getSunColor(inverse, sunColor)} />
        <text
          className={cn('brand-logo__wordmark', compactWordmark && 'brand-logo__wordmark--compact')}
          fill="currentColor"
          {...wordmarkProps}
        >
          {compactWordmark ? (
            <>
              <tspan className="brand-logo__regular">UBATUBA</tspan>
              <tspan className="brand-logo__regular" dx="0.02em">
                STAY
              </tspan>
            </>
          ) : (
            <>
              <tspan className="brand-logo__hair" x="0" y="0">
                UBATUBA
              </tspan>
              <tspan className="brand-logo__regular" x="159.86" y="0">
                STAY
              </tspan>
            </>
          )}
        </text>
      </g>
    </BrandSvg>
  );
}
