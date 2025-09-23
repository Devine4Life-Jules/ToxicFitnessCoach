import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';

type Coordinates = {
  x: number;
  y: number;
  z: number;
};

export default function HomeScreen() {
  const [{ x, y, z }, setData] = useState<Coordinates>({ x: 0, y: 0, z: 0 });

  const lastMovement = useRef<number>(Date.now());
  const lastCoords = useRef<Coordinates>({ x: 0, y: 0, z: 0 });
const idleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const MOVEMENT_THRESHOLD = 0.02; // minimal movement to reset idle timer
  const IDLE_TIME_MS = 10000; // 10 seconds

  useEffect(() => {
    Accelerometer.setUpdateInterval(1000); // check every 1s
    const subscription = Accelerometer.addListener((data: Coordinates) => {
      setData(data);

      // Calculate the difference
      const dx = Math.abs(data.x - lastCoords.current.x);
      const dy = Math.abs(data.y - lastCoords.current.y);
      const dz = Math.abs(data.z - lastCoords.current.z);

      if (dx > MOVEMENT_THRESHOLD || dy > MOVEMENT_THRESHOLD || dz > MOVEMENT_THRESHOLD) {
        // Device moved → reset timer
        lastMovement.current = Date.now();
        lastCoords.current = data;

        if (idleTimeout.current) {
          clearTimeout(idleTimeout.current);
          idleTimeout.current = null;
          alert("device moved");
        }
      } else {
        // No significant movement → start idle timeout
        if (!idleTimeout.current) {
          idleTimeout.current = setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }, IDLE_TIME_MS - (Date.now() - lastMovement.current));
        }
      }
    });

    return () => {
      subscription.remove();
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, []);

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: 'Toxic Fitness Coach' }} />
      <ThemedText>x: {x.toFixed(2)}</ThemedText>
      <ThemedText>y: {y.toFixed(2)}</ThemedText>
      <ThemedText>z: {z.toFixed(2)}</ThemedText>
    </ThemedView>
  );
}
