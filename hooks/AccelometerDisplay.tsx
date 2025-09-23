import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Coordinates } from './useAccelerometer';

export function AccelerometerDisplay({ x = 0, y = 0, z = 0 }: Partial<Coordinates>) {
  return (
    <ThemedView>
      <ThemedText>x: {x.toFixed(2)}</ThemedText>
      <ThemedText>y: {y.toFixed(2)}</ThemedText>
      <ThemedText>z: {z.toFixed(2)}</ThemedText>
    </ThemedView>
  );
}
