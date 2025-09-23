import { useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import type { Coordinates } from './useAccelerometer';


export function useIdleDetection(
  enabled: boolean,
  data: Coordinates,
  onIdle: () => void,
  onMove?: () => void,
  threshold: number = 0.02,
  idleTime: number = 10000
) {
  const lastCoords = useRef<Coordinates>(data);
  const idleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMoved = useRef(false);

  useEffect(() => {
    if (!enabled) {
      if (idleTimeout.current) {
        clearTimeout(idleTimeout.current);
        idleTimeout.current = null;
      }
      lastCoords.current = data;
      hasMoved.current = false;
      return;
    }

    const dx = Math.abs(data.x - lastCoords.current.x);
    const dy = Math.abs(data.y - lastCoords.current.y);
    const dz = Math.abs(data.z - lastCoords.current.z);

    const isMoving = dx > threshold || dy > threshold || dz > threshold;

    if (isMoving) {
      // Only fire onMove once per movement
      if (!hasMoved.current) {
        onMove?.();
        hasMoved.current = true;
      }

      // Reset idle timeout if it exists
      if (idleTimeout.current) {
        clearTimeout(idleTimeout.current);
        idleTimeout.current = null;
      }

      lastCoords.current = data;
    } else {
      // Device is still
      hasMoved.current = false;

      if (!idleTimeout.current) {
        idleTimeout.current = setTimeout(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          onIdle();
          idleTimeout.current = null; // allow next idle
        }, idleTime);
      }
    }
  }, [enabled, data, threshold, idleTime, onIdle, onMove]);
}
