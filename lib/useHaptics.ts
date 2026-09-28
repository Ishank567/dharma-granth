'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getHapticsEnabled,
  setHapticsEnabled,
  getSoundEnabled,
  setSoundEnabled,
  isHapticsSupported,
  triggerHaptic,
  playSoundEffect,
  triggerTactileFeedback,
  type HapticPattern,
  type SoundEffect,
} from './haptics';

export function useHaptics() {
  const [hapticsOn, setHapticsOn] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [hasHapticsHardware, setHasHapticsHardware] = useState(false);

  useEffect(() => {
    setHapticsOn(getHapticsEnabled());
    setSoundOn(getSoundEnabled());
    setHasHapticsHardware(isHapticsSupported());

    const onHapticChange = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean }>;
      if (custom.detail) setHapticsOn(custom.detail.enabled);
    };

    const onSoundChange = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean }>;
      if (custom.detail) setSoundOn(custom.detail.enabled);
    };

    window.addEventListener('dharma-haptics-change', onHapticChange);
    window.addEventListener('dharma-sound-change', onSoundChange);

    return () => {
      window.removeEventListener('dharma-haptics-change', onHapticChange);
      window.removeEventListener('dharma-sound-change', onSoundChange);
    };
  }, []);

  const toggleHaptics = useCallback(() => {
    const next = !hapticsOn;
    setHapticsEnabled(next);
    setHapticsOn(next);
    if (next) triggerHaptic('success');
  }, [hapticsOn]);

  const toggleSound = useCallback(() => {
    const next = !soundOn;
    setSoundEnabled(next);
    setSoundOn(next);
    if (next) {
      playSoundEffect('templeChime');
    }
  }, [soundOn]);

  const feedback = useCallback(
    (haptic: HapticPattern = 'light', sound: SoundEffect = 'click') => {
      triggerTactileFeedback(haptic, sound);
    },
    []
  );

  return {
    hapticsOn,
    soundOn,
    hasHapticsHardware,
    toggleHaptics,
    toggleSound,
    triggerHaptic,
    playSoundEffect,
    feedback,
  };
}
