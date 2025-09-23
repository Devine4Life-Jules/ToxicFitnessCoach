import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Coordinates } from './useAccelerometer';
import { StyleSheet } from 'react-native';

export function AccelerometerDisplay({ x = 0, y = 0, z = 0 }: Partial<Coordinates>) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>x: {x.toFixed(2)}</ThemedText>
      <ThemedText>y: {y.toFixed(2)}</ThemedText>
      <ThemedText>z: {z.toFixed(2)}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
    }
})


