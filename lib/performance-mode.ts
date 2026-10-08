'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

export interface PerformanceModeState {
  isLowPower: boolean;
  isDataSaver: boolean;
  /** The reader's explicit "Reading Lite" choice: no 3D, decoration or large effects; all text stays. */
  isReadingLite: boolean;
  isLiteMode: boolean; // true if either low power or data saver or reduced motion
}

const DATA_SAVER_KEY = 'dharma.perf.dataSaver';
const LOW_POWER_KEY = 'dharma.perf.lowPower';
const READING_LITE_KEY = 'dharma.perf.readingLite';

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

let currentState: PerformanceModeState = {
  isLowPower: false,
  isDataSaver: false,
  isReadingLite: false,
  isLiteMode: false,
};

let initialized = false;

function detectBrowserDataSaver(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') return true;
  return false;
}

function initDetection() {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

  // 1. Check saved preferences
  let savedDataSaver: boolean | null = null;
  let savedLowPower: boolean | null = null;
  try {
    const ds = localStorage.getItem(DATA_SAVER_KEY);
    if (ds !== null) savedDataSaver = ds === 'true';
    const lp = localStorage.getItem(LOW_POWER_KEY);
    if (lp !== null) savedLowPower = lp === 'true';
  } catch {}

  const browserDataSaver = detectBrowserDataSaver();
  const isDataSaver = savedDataSaver !== null ? savedDataSaver : browserDataSaver;

  // 2. Low power: check battery or low hardware concurrency
  let isLowPower = savedLowPower !== null ? savedLowPower : false;
  if (savedLowPower === null && typeof navigator !== 'undefined') {
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
      isLowPower = true;
    }
  }

  // Battery status API
  if (savedLowPower === null && typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    (navigator as unknown as { getBattery: () => Promise<{ level: number; charging: boolean; addEventListener: (type: string, cb: () => void) => void }> })
      .getBattery()
      .then((battery) => {
        const updateBattery = () => {
          const batteryLow = battery.level <= 0.2 && !battery.charging;
          if (savedLowPower === null && batteryLow !== currentState.isLowPower) {
            currentState = {
              ...currentState,
              isLowPower: batteryLow,
              isLiteMode: batteryLow || currentState.isDataSaver || currentState.isReadingLite,
            };
            syncDom(currentState);
            notify();
          }
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      })
      .catch(() => {});
  }

  // Network change listener
  if (typeof navigator !== 'undefined') {
    const conn = (navigator as unknown as { connection?: { addEventListener: (t: string, cb: () => void) => void } }).connection;
    if (conn?.addEventListener) {
      conn.addEventListener('change', () => {
        if (savedDataSaver === null) {
          const netDataSaver = detectBrowserDataSaver();
          if (netDataSaver !== currentState.isDataSaver) {
            currentState = {
              ...currentState,
              isDataSaver: netDataSaver,
              isLiteMode: netDataSaver || currentState.isLowPower || currentState.isReadingLite,
            };
            syncDom(currentState);
            notify();
          }
        }
      });
    }
  }

  let isReadingLite = false;
  try {
    isReadingLite = localStorage.getItem(READING_LITE_KEY) === 'true';
  } catch {}

  currentState = {
    isLowPower,
    isDataSaver,
    isReadingLite,
    isLiteMode: isLowPower || isDataSaver || isReadingLite,
  };
  syncDom(currentState);
  notify();
}

function syncDom(state: PerformanceModeState) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (state.isDataSaver) root.setAttribute('data-data-saver', 'true');
  else root.removeAttribute('data-data-saver');

  if (state.isReadingLite) root.setAttribute('data-reading-lite', 'true');
  else root.removeAttribute('data-reading-lite');

  if (state.isLowPower) root.setAttribute('data-low-power', 'true');
  else root.removeAttribute('data-low-power');

  if (state.isLiteMode) root.setAttribute('data-lite-mode', 'true');
  else root.removeAttribute('data-lite-mode');
}

export function setDataSaver(enabled: boolean) {
  try {
    localStorage.setItem(DATA_SAVER_KEY, String(enabled));
  } catch {}
  currentState = {
    ...currentState,
    isDataSaver: enabled,
    isLiteMode: enabled || currentState.isLowPower || currentState.isReadingLite,
  };
  syncDom(currentState);
  notify();
}

export function setLowPower(enabled: boolean) {
  try {
    localStorage.setItem(LOW_POWER_KEY, String(enabled));
  } catch {}
  currentState = {
    ...currentState,
    isLowPower: enabled,
    isLiteMode: currentState.isDataSaver || enabled || currentState.isReadingLite,
  };
  syncDom(currentState);
  notify();
}

export function setReadingLite(enabled: boolean) {
  try {
    localStorage.setItem(READING_LITE_KEY, String(enabled));
  } catch {}
  currentState = {
    ...currentState,
    isReadingLite: enabled,
    isLiteMode: enabled || currentState.isDataSaver || currentState.isLowPower,
  };
  syncDom(currentState);
  notify();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  if (!initialized) initDetection();
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): PerformanceModeState {
  if (!initialized && typeof window !== 'undefined') initDetection();
  return currentState;
}

// Must be referentially stable: React treats a fresh object per call as an infinite loop.
const SERVER_SNAPSHOT: PerformanceModeState = {
  isLowPower: false,
  isDataSaver: false,
  isReadingLite: false,
  isLiteMode: false,
};

function getServerSnapshot(): PerformanceModeState {
  return SERVER_SNAPSHOT;
}

export function usePerformanceMode():PerformanceModeState & {
  setDataSaver: (enabled: boolean) => void;
  setLowPower: (enabled: boolean) => void;
  setReadingLite: (enabled: boolean) => void;
  toggleDataSaver: () => void;
  toggleLowPower: () => void;
} {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    ...state,
    setDataSaver,
    setLowPower,
    setReadingLite,
    toggleDataSaver: () => setDataSaver(!state.isDataSaver),
    toggleLowPower: () => setLowPower(!state.isLowPower),
  };
}
