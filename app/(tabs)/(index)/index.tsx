import { Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { AccelerometerDisplay } from '@/hooks/AccelometerDisplay';
import { useAccelerometer } from '@/hooks/useAccelerometer';
import { useIdleDetection } from '@/hooks/useIdleDetection';
import CircleButton from '@/components/CircleButton';
import { StyleSheet, AppState, TextInput, View } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import * as Notifications from 'expo-notifications';

export default function HomeScreen() {
  const coords = useAccelerometer(1000);
  const [idleEnabled, setIdleEnabled] = useState(true);
  const [idleTime, setIdleTime] = useState(10000); // ms
  const appState = useRef(AppState.currentState);

    // For timer reset
    const [resetKey, setResetKey] = useState(0);

  // Track app state
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  // List of random activation/insult messages
  const activationMessages = [
    "Get moving!",
    "Don't just sit there!",
    "Time to shake that booty!",
    "Move it, move it!",
    "Are you a statue now?",
    "Lazy bum detected!",
    "Your couch misses you, but your body doesn't!",
    "Let's go, slacker!",
    "Up and at 'em!",
    "You call that fitness?",
    "Stop scrolling and start moving!",
    "You can do better!",
    "The world won't wait for you!",
    "Don't make me come over there!",
    "Activate beast mode!"
  ];

  function getRandomMessage() {
    const idx = Math.floor(Math.random() * activationMessages.length);
    return activationMessages[idx];
  }

  useIdleDetection(
    idleEnabled,
    coords,
    async () => {
      // Timer ran out (idle)
      setResetKey(k => k + 1);
      const message = getRandomMessage();
      if (appState.current === 'active') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: message,
          },
          trigger: null,
        });
      } else {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: message,
          },
          trigger: null,
        });
      }
    },
    async () => {
      // Movement detected
      setResetKey(k => k + 1);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Device moved',
          body: 'Movement detected.',
        },
        trigger: null,
      });
    },
    0.02,
    idleTime
  );

  // Track lazy bum notification timeout
  const lazyBumTimeout = useRef<number | null>(null);

  const toggleIdleDetection = async () => {
    setIdleEnabled(prev => {
      const next = !prev;
      Notifications.scheduleNotificationAsync({
        content: {
          title: next ? 'Idle detection turned on' : 'Idle detection turned off',
        },
        trigger: null,
      });
      // If turning off, schedule lazy bum notification after 10s
      if (!next) {
        lazyBumTimeout.current = window.setTimeout(() => {
          Notifications.scheduleNotificationAsync({
            content: {
              title: 'turn me on you lazy bum',
            },
            trigger: null,
          });
        }, 10000);
      } else {
        // If turning on, clear any pending lazy bum notification
        if (lazyBumTimeout.current) {
          clearTimeout(lazyBumTimeout.current);
          lazyBumTimeout.current = null;
        }
      }
      return next;
    });
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: 'Toxic Fitness Coach' }} />
        {/* Input field for idle countdown timer */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(idleTime / 1000)}
            onChangeText={text => {
              const val = Math.max(1, parseInt(text) || 1);
              setIdleTime(val * 1000);
              setResetKey(k => k + 1);
            }}
            placeholder="Idle seconds"
          />
        </View>
        <CountdownTimer
          duration={idleTime}
          resetTrigger={idleEnabled ? resetKey : -1}
          onTimeout={() => setResetKey(k => k + 1)}
          inactive={!idleEnabled}
        />
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
  inputContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    fontSize: 20,
    width: 120,
    padding: 8,
    borderWidth: 1,
    borderColor: '#1e90ff',
    borderRadius: 8,
    backgroundColor: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
});
