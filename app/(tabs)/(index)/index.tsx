import { Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { AccelerometerDisplay } from '@/hooks/AccelometerDisplay';
import { useAccelerometer } from '@/hooks/useAccelerometer';
import { useIdleDetection } from '@/hooks/useIdleDetection';
import CircleButton from '@/components/CircleButton';
import { StyleSheet, AppState } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

export default function HomeScreen() {
  const coords = useAccelerometer(1000);
  const [idleEnabled, setIdleEnabled] = useState(true);
  const appState = useRef(AppState.currentState);

  // Track app state
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  useIdleDetection(
    idleEnabled,
    coords,
    async () => {
      if (appState.current === 'active') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Get Moving!',
            body: 'You have been inactive for 10 seconds.',
          },
          trigger: null,
        });
      } else {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Get Moving!',
            body: 'You have been inactive for 10 seconds.',
          },
          trigger: null,
        });
      }
    },
    async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Device moved',
          body: 'Movement detected.',
        },
        trigger: null,
      });
    }
  );

  const toggleIdleDetection = async () => {
    setIdleEnabled(prev => {
      const next = !prev;
      Notifications.scheduleNotificationAsync({
        content: {
          title: next ? 'Idle detection turned on' : 'Idle detection turned off',
        },
        trigger: null,
      });
      return next;
    });
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: 'Toxic Fitness Coach' }} />
      <AccelerometerDisplay {...coords} />

      <ThemedView style={styles.buttonContainer}>
        <CircleButton idleEnabled={idleEnabled} onPress={toggleIdleDetection} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
