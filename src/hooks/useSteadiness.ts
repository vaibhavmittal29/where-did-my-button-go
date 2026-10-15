import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseSteadinessOptions {
  initialValue?: number;
}

export function useSteadiness(options: UseSteadinessOptions = {}) {
  const [steadiness, setSteadinessState] = useState<number>(options.initialValue ?? 0.88);
  const [isHoldingSpace, setIsHoldingSpace] = useState<boolean>(false);
  const [isRealSensorEnabled, setIsRealSensorEnabled] = useState<boolean>(false);
  const [sensorActive, setSensorActive] = useState<boolean>(false);
  const [sensorError, setSensorError] = useState<string | null>(null);

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
      // Ignore if user is interacting with an input or form control
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsHoldingSpace(true);
        setSteadinessState(0.96);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes((e.target as HTMLElement)?.tagName)) return;
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

  // 2. Explicit User Toggle for Real Hardware Motion Sensing
  const toggleRealSensor = useCallback(async () => {
    if (isRealSensorEnabled) {
      setIsRealSensorEnabled(false);
      setSensorActive(false);
      setSensorError(null);
      setSteadinessState(baseValueRef.current);
      return;
    }

    if (typeof window === 'undefined') return;

    // Feature detection
    if (!('DeviceMotionEvent' in window)) {
      setSensorError('DeviceMotionEvent is not supported on this browser or hardware.');
      return;
    }

    // iOS 13+ permission request
    const DME = window.DeviceMotionEvent as unknown as { requestPermission?: () => Promise<'granted' | 'denied'> };
    if (typeof DME.requestPermission === 'function') {
      try {
        const response = await DME.requestPermission();
        if (response !== 'granted') {
          setSensorError('Motion sensor permission was denied by user.');
          return;
        }
      } catch (err) {
        setSensorError(`Motion sensor permission request failed: ${err instanceof Error ? err.message : String(err)}`);
        return;
      }
    }

    setSensorError(null);
    setIsRealSensorEnabled(true);
  }, [isRealSensorEnabled]);

  // 3. Real Motion Listener (only active when explicitly enabled)
  useEffect(() => {
    if (!isRealSensorEnabled || typeof window === 'undefined') return;

    let lastTime = Date.now();
    let smoothedJitter = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const now = Date.now();
      if (now - lastTime < 50) return; // 20Hz sample rate
      lastTime = now;

      // Prefer acceleration excluding gravity; fallback to accelerationIncludingGravity with high-pass delta
      const acc = event.acceleration;
      if (!acc || (acc.x === null && acc.y === null && acc.z === null)) {
        // Fallback: use event.accelerationIncludingGravity magnitude delta
        return;
      }

      setSensorActive(true);

      const magnitude = Math.sqrt(
        (acc.x || 0) ** 2 +
        (acc.y || 0) ** 2 +
        (acc.z || 0) ** 2
      );

      // Conservative prototype heuristic: smoothed exponential moving average of acceleration magnitude
      smoothedJitter = smoothedJitter * 0.7 + magnitude * 0.3;

      // Map jitter to steadiness score (0 jitter -> 1.0 steadiness, >= 1.8 m/s² -> 0 steadiness)
      const computedSteadiness = Math.max(0, Math.min(1, 1 - smoothedJitter / 1.8));
      setSteadinessState(Number(computedSteadiness.toFixed(3)));
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      setSensorActive(false);
    };
  }, [isRealSensorEnabled]);

  return {
    steadiness,
    setSteadiness,
    triggerShake,
    isHoldingSpace,
    sensorActive,
    isRealSensorEnabled,
    toggleRealSensor,
    sensorError,
  };
}
