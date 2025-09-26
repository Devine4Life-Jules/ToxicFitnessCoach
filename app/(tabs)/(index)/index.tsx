import { Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { AccelerometerDisplay } from '@/hooks/AccelometerDisplay';
import { useAccelerometer } from '@/hooks/useAccelerometer';
import { useIdleDetection } from '@/hooks/useIdleDetection';
import CircleButton from '@/components/CircleButton';
import { StyleSheet, AppState, Image } from 'react-native';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import * as Speech from 'expo-speech';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';

// Voice configuration for consistent male English voice
const initializeVoice = async () => {
  const voices = await Speech.getAvailableVoicesAsync();
  return voices.find(voice => 
    voice.language.startsWith('en') && 
    voice.quality === Speech.VoiceQuality.Enhanced &&
    voice.gender === 'male'
  )?.identifier;
};
import { useSettingsStore } from '@/hooks/use-settings-store';
import coach from '../../../assets/images/coach.png';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function HomeScreen() {
  const coords = useAccelerometer(1000);
  const [idleEnabled, setIdleEnabled] = useState(true);
  const { idleMinutes, idleSeconds, isSettingsTabActive } = useSettingsStore();
  const idleTime = (idleMinutes * 60 + idleSeconds) * 1000;
  const appState = useRef(AppState.currentState);

  // Request notification permissions
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    }
    requestPermissions();
  }, []);

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
  const activationMessages = useMemo(() => [
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
  ], []);

  const getRandomMessage = useCallback(() => {
    const idx = Math.floor(Math.random() * activationMessages.length);
    return activationMessages[idx];
  }, [activationMessages]);

  const handleIdle = useCallback(async () => {
    const message = getRandomMessage();
    Speech.speak(message, {
      language: 'en-GB',
      pitch: 0.9,
      rate: 0.9,
      voice: 'com.apple.voice.compact.en-GB.Daniel'
    });
    
    // Show toast message
    Toast.show({
      type: 'info',
      text1: message,
    });
    
    // Show system notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Toxic Fitness Coach',
        body: message,
        sound: true,
      },
      trigger: null,
    });
    
    setResetKey(k => k + 1);
  }, [getRandomMessage]);

  const handleMovement = useCallback(async () => {
    Speech.speak('Movement detected.', {
      language: 'en-GB',
      pitch: 0.9,
      rate: 0.9,
      voice: 'com.apple.voice.compact.en-GB.Daniel'
    });
    
    // Show toast message
    Toast.show({
      type: 'success',
      text1: 'Device moved',
      text2: 'Movement detected.',
    });
    
    // Show system notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Movement Detected',
        body: 'Good job! Keep moving!',
        sound: true,
      },
      trigger: null,
    });
    
    setResetKey(k => k + 1);
  }, []);

  useIdleDetection(
    idleEnabled,
    coords,
    handleIdle,
    handleMovement,
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
        lazyBumTimeout.current = setTimeout(() => {
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
        onTimeout={useCallback(() => setResetKey(k => k + 1), [])}
        inactive={!idleEnabled || isSettingsTabActive}
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
