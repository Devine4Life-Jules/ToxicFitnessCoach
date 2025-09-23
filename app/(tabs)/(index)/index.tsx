import { Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { AccelerometerDisplay } from '@/hooks/AccelometerDisplay';
import { useAccelerometer } from '@/hooks/useAccelerometer';
import { useIdleDetection } from '@/hooks/useIdleDetection';

export default function HomeScreen() {
  const coords = useAccelerometer(1000);

  useIdleDetection(
    true,
    coords,
    () => alert('Get Moving'),
    () => alert('Device moved')
  );

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: 'Toxic Fitness Coach' }} />
      <AccelerometerDisplay {...coords} />
    </ThemedView>
  );
}
