import { useEffect } from 'react';

/** Sayfadaki ".reveal" ve ".reveal-clip" öğelerine ekrana girdiklerinde "is-visible" ekler (kaydırınca belirme efekti) */
export const useRevealOnScroll = (deps: unknown) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }),
      { threshold: 0.2 },
    );
    document.querySelectorAll('section .reveal, section .reveal-clip').forEach((el) => {
      if (!el.closest('[role=dialog]')) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [deps]);
};
