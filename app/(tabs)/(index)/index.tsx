import { Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { AccelerometerDisplay } from '@/hooks/AccelometerDisplay';
import { useAccelerometer } from '@/hooks/useAccelerometer';
import { useIdleDetection } from '@/hooks/useIdleDetection';
import CircleButton from '@/components/CircleButton';
import { StyleSheet, AppState, TextInput, View, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import * as Speech from 'expo-speech';
import Toast from 'react-native-toast-message';
import coach from '../../../assets/images/coach.png';

export default function HomeScreen() {
  const coords = useAccelerometer(1000);
  const [idleEnabled, setIdleEnabled] = useState(true);
  const [idleMinutes, setIdleMinutes] = useState(0);
  const [idleSeconds, setIdleSeconds] = useState(10);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <Stack.Screen options={{ title: 'Toxic Fitness Coach' }} />
        {/* Input fields for idle countdown timer (minutes and seconds) */}
        <View style={styles.inputContainer}>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(idleMinutes)}
              onChangeText={text => {
                const val = Math.max(0, parseInt(text) || 0);
                setIdleMinutes(val);
                setResetKey(k => k + 1);
              }}
              placeholder="Minutes"
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(idleSeconds)}
              onChangeText={text => {
                let val = Math.max(0, parseInt(text) || 0);
                if (val > 59) val = 59;
                setIdleSeconds(val);
                setResetKey(k => k + 1);
              }}
              placeholder="Seconds"
            />
          </View>
        </View>
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
    </TouchableWithoutFeedback>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: 20,
    width: 80,
    padding: 8,
    borderWidth: 1,
    borderColor: '#1e90ff',
    borderRadius: 8,
    backgroundColor: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    marginHorizontal: 4,
  },
});
