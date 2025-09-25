import { Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { AccelerometerDisplay } from '@/hooks/AccelometerDisplay';
import { useAccelerometer } from '@/hooks/useAccelerometer';
import { useIdleDetection } from '@/hooks/useIdleDetection';
import CircleButton from '@/components/CircleButton';
import { StyleSheet, AppState, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import * as Speech from 'expo-speech';
import Toast from 'react-native-toast-message';
import { useSettingsStore } from '@/hooks/use-settings-store';
import coach from '../../../assets/images/coach.png';

export default function HomeScreen() {
  const coords = useAccelerometer(1000);
  const [idleEnabled, setIdleEnabled] = useState(true);
  const { idleMinutes, idleSeconds } = useSettingsStore();
  const idleTime = (idleMinutes * 60 + idleSeconds) * 1000;
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
    "Let's go, slacker!",
    "Up and at 'em!",
    "You call that fitness?",
    "Stop scrolling and start moving!",
    "You can do better!",
    "The world won't wait for you!",
    "Don't make me come over there!",
    "Activate beast mode!",
    "just do it!"
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
      // Speak the notification aloud
      Speech.speak(message);
      Toast.show({
        type: 'info',
        text1: message,
      });
    },
    async () => {
      // Movement detected
      setResetKey(k => k + 1);
      Speech.speak('Movement detected.');
      Toast.show({
        type: 'success',
        text1: 'Device moved',
        text2: 'Movement detected.',
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
      Toast.show({
        type: 'info',
        text1: next ? 'Idle detection turned on' : 'Idle detection turned off',
      });
      // If turning off, schedule lazy bum notification after 10s
      if (!next) {
        lazyBumTimeout.current = window.setTimeout(() => {
          Toast.show({
            type: 'info',
            text1: 'turn me on you lazy bum',
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
      <ThemedView style={{ alignItems: 'center' }}>
        <Image
          source={coach}
          style={{ width: 150, height: 150, marginBottom: 8 }}
          resizeMode="contain"
        />
      </ThemedView>
      <CountdownTimer
        duration={idleTime}
        resetTrigger={idleEnabled ? resetKey : -1}
        onTimeout={() => setResetKey(k => k + 1)}
        inactive={!idleEnabled}
      />
      {/* <AccelerometerDisplay {...coords} /> */}

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
