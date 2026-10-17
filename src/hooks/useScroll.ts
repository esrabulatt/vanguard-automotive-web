import React, { useEffect, useState } from 'react';
import { clamp, lerp } from '../utils/math';

// Kaydırma ilerlemesi (0-1). Değer hedefe yumuşakça yaklaşır; böylece
// tekerlek/trackpad adımları kesik kesik değil, video gibi akıcı görünür.
export const useSmoothScrollProgress = (ref: React.RefObject<HTMLElement | null>) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let current = 0;

    const target = () => {
      const el = ref.current;
      if (!el) return 0;
      const scrollable = el.offsetHeight - window.innerHeight;
      return scrollable > 0 ? clamp(-el.getBoundingClientRect().top / scrollable) : 0;
    };

    const tick = () => {
      const goal = target();
      current = reducedMotion ? goal : lerp(current, goal, 0.12);
      if (Math.abs(goal - current) < 0.0005) current = goal;
      setProgress(current);
      frame = current === goal ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    current = target();
    setProgress(current);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);

  return progress;
};
