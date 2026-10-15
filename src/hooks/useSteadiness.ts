import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseSteadinessOptions {
  initialValue?: number;
}

export function useSteadiness(options: UseSteadinessOptions = {}) {
  const [steadiness, setSteadinessState] = useState<number>(options.initialValue ?? 0.88);
  const [isHoldingSpace, setIsHoldingSpace] = useState<boolean>(false);
  const [sensorActive, setSensorActive] = useState<boolean>(false);

  const baseValueRef = useRef<number>(options.initialValue ?? 0.88);
  const shakeTimeoutRef = useRef<number | null>(null);

  // Manual setter (e.g. from DemoPanel slider)
  const setSteadiness = useCallback((val: number) => {
    baseValueRef.current = Math.max(0, Math.min(1, val));
    setSteadinessState(baseValueRef.current);
  }, []);

  // Simulate an instant jolt/shake
  const triggerShake = useCallback(() => {
    setSteadinessState(0.15);
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = window.setTimeout(() => {
      setSteadinessState(baseValueRef.current);
    }, 450);
  }, []);

  // 1. Spacebar Hold Simulation for Laptop / Desktop Demo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing into an input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsHoldingSpace(true);
        setSteadinessState(0.96);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsHoldingSpace(false);
        setSteadinessState(baseValueRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    };
  }, []);

  // 2. Real Hardware Motion Sensor (DeviceMotionEvent) for Mobile Phones
  useEffect(() => {
    if (typeof window === 'undefined' || !window.DeviceMotionEvent) return;

    let lastTime = Date.now();
    let smoothedVariance = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const now = Date.now();
      if (now - lastTime < 50) return; // 20Hz sample rate
      lastTime = now;

      const acc = event.acceleration;
      if (!acc || acc.x === null) return;

      setSensorActive(true);

      const magnitude = Math.sqrt(
        (acc.x || 0) ** 2 +
        (acc.y || 0) ** 2 +
        (acc.z || 0) ** 2
      );

      // Smooth moving average of acceleration jitter
      smoothedVariance = smoothedVariance * 0.7 + magnitude * 0.3;

      // Map jitter to steadiness score (0 jitter -> 1.0 steadiness, > 1.8 m/s² -> 0 steadiness)
      const computedSteadiness = Math.max(0, Math.min(1, 1 - smoothedVariance / 1.8));
      setSteadinessState(computedSteadiness);
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  return {
    steadiness,
    setSteadiness,
    triggerShake,
    isHoldingSpace,
    sensorActive,
  };
}
