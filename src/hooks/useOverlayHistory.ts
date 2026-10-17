import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { registerOverlayNavigator, useCarStore, type UrlPatch } from '../store/useCarStore';

/**
 * Katmanları adres çubuğuyla eşler. Açılan her katman tarayıcı geçmişine bir adım ekler;
 * kapatırken o adım bizim eklediğimiz adımsa geri gidilir (geri tuşuyla aynı davranış),
 * değilse (ör. paylaşılan linkle gelindiyse) parametre yerinde silinir.
 */
export const useOverlayHistory = () => {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const syncFromUrl = useCarStore((s) => s.syncFromUrl);
  const current = useRef({ params, location });

  useLayoutEffect(() => {
    current.current = { params, location };
    syncFromUrl(params);
  }, [params, location, syncFromUrl]);

  useEffect(() => {
    registerOverlayNavigator({
      open: (patch: UrlPatch, opts) => {
        const { params: p, location: loc } = current.current;
        const next = new URLSearchParams(p);
        // Menüden bir yere gidilirken menünün geçmiş adımı yenisiyle değiştirilir
        const fromMenu = next.has('menu') && !('menu' in patch);
        if (fromMenu) next.delete('menu');
        for (const [key, value] of Object.entries(patch)) {
          if (value === null) next.delete(key);
          else next.set(key, value);
        }
        if (next.toString() === p.toString()) return;
        navigate(
          { pathname: loc.pathname, search: next.toString() ? `?${next}` : '' },
          { replace: opts?.replace || fromMenu, state: { overlay: Object.keys(patch)[0], pushed: !(opts?.replace || fromMenu) || loc.state?.pushed } },
        );
      },
      close: (keys: string[]) => {
        const { params: p, location: loc } = current.current;
        if (!keys.some((k) => p.has(k))) return;
        if (loc.state?.pushed && keys.includes(loc.state.overlay)) {
          navigate(-1);
          return;
        }
        const next = new URLSearchParams(p);
        keys.forEach((k) => next.delete(k));
        navigate({ pathname: loc.pathname, search: next.toString() ? `?${next}` : '' }, { replace: true });
      },
    });
  }, [navigate]);
};
