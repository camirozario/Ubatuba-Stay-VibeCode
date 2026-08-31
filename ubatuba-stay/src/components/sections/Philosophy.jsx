import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Section } from '../layout/Section';

const ROTATING_PHRASES = [
  'apresentações impecáveis',
  'uma experiência em um único aplicativo',
  'fotografias que transformam estadias em desejo',
  'hospitalidade pensada nos detalhes',
  'gestão que valoriza cada imóvel',
  'experiências que começam antes do check-in',
  'seu imóvel, apresentado como ele merece',
  'cada detalhe pensado para receber melhor',
  'mais cuidado. mais valor. mais experiência.',
];

const HOLD_DURATION_MS = 2600;
const ROLL_DURATION_MS = 1100;
const ROLL_DISTANCE = '116%';
const LONGEST_PHRASE = ROTATING_PHRASES.reduce((longest, phrase) => (
  phrase.length > longest.length ? phrase : longest
), ROTATING_PHRASES[0]);

function getNextIndex(index) {
  return (index + 1) % ROTATING_PHRASES.length;
}

export function Philosophy() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(() => getNextIndex(0));
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || isRolling) return undefined;

    const holdTimeout = window.setTimeout(() => {
      setIsRolling(true);
    }, HOLD_DURATION_MS);

    return () => {
      window.clearTimeout(holdTimeout);
    };
  }, [currentIndex, isRolling, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || !isRolling) return undefined;

    const swapTimeout = window.setTimeout(() => {
      setCurrentIndex(nextIndex);
      setNextIndex(getNextIndex(nextIndex));
      setIsRolling(false);
    }, ROLL_DURATION_MS);

    return () => {
      window.clearTimeout(swapTimeout);
    };
  }, [isRolling, nextIndex, prefersReducedMotion]);

  const currentPhrase = ROTATING_PHRASES[currentIndex];
  const nextPhrase = ROTATING_PHRASES[nextIndex];

  return (
    <Section
      id="sobre"
      bg="sand"
      className="relative z-10 hidden overflow-visible py-0 lg:block"
      containerClassName="flex min-h-[100svh] items-center justify-center"
    >
      <div className="philosophy-transition-target w-full text-center">
        <p className="philosophy-declaration" aria-label={`Criamos ${currentPhrase}`}>
          <span aria-hidden="true">Criamos</span>
          <span className="philosophy-roller" aria-hidden="true">
            <span className="philosophy-roller__measure">{LONGEST_PHRASE}</span>
            <span className="philosophy-roller__viewport">
              {prefersReducedMotion ? (
                <span className="philosophy-roller__line philosophy-roller__line--static">
                  {currentPhrase}
                </span>
              ) : (
                <>
                  <span
                    key={`current-${currentIndex}`}
                    className="philosophy-roller__line"
                    style={{
                      transform: isRolling ? `translateY(-${ROLL_DISTANCE})` : 'translateY(0%)',
                      opacity: isRolling ? 0 : 1,
                    }}
                  >
                    {currentPhrase}
                  </span>
                  <span
                    key={`next-${nextIndex}`}
                    className="philosophy-roller__line"
                    style={{
                      transform: isRolling ? 'translateY(0%)' : `translateY(${ROLL_DISTANCE})`,
                      opacity: isRolling ? 1 : 0,
                    }}
                  >
                    {nextPhrase}
                  </span>
                </>
              )}
            </span>
          </span>
        </p>
      </div>
    </Section>
  );
}
