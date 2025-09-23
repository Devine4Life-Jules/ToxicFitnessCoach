import { Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { AccelerometerDisplay } from '@/hooks/AccelometerDisplay';
import { useAccelerometer } from '@/hooks/useAccelerometer';
import { useIdleDetection } from '@/hooks/useIdleDetection';
import Toast from 'react-native-toast-message';
import CircleButton from '@/components/CircleButton';

export default function HomeScreen() {
  const coords = useAccelerometer(1000);

useIdleDetection(
  true,
  coords,
  () =>
    Toast.show({
      type: 'info',
      text1: 'Get Moving!',
      text2: 'You have been inactive for 10 seconds.',
      visibilityTime: 3000,
      position: 'top',
    }),
  () =>
    Toast.show({
      type: 'success',
      text1: 'Device moved',
      visibilityTime: 1500,
      position: 'top',
    })
);

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: 'Toxic Fitness Coach' }} />
      <AccelerometerDisplay {...coords} />
      <CircleButton onPress={() => alert('pressed')} />
    </ThemedView>
  );
}
