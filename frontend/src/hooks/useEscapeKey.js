import { useEffect } from 'react';

export function useEscapeKey(handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e) => {
      if (e.key === 'Escape') handler();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handler, enabled]);
}
