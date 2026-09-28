'use client';

import { useEffect } from 'react';
import { isHapticSwitchEvent, triggerHaptic } from '@/lib/haptics';

const INTERACTIVE =
  'button, a[href], [role="button"], [role="option"], [role="tab"], [role="switch"], summary, label, select, input[type="checkbox"], input[type="radio"]';

/**
 * Site-wide tactile feedback: a light haptic on every tap of an interactive
 * element, so the whole UI feels physical without wiring each component.
 *
 * Listens in the bubble phase on document, which runs after React's own
 * handlers (attached at the root). Components that fire a richer pattern
 * (success, mala bead…) therefore win, and haptics.ts drops this duplicate.
 * The visual press is CSS (`scale` on :active in globals.css).
 */
export function TactileLayer() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (isHapticSwitchEvent(e) || !(e.target instanceof Element)) return;
      const el = e.target.closest(INTERACTIVE);
      if (!el || el.matches(':disabled, [aria-disabled="true"]')) return;
      triggerHaptic('light');
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
