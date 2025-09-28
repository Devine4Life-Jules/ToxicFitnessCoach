import { Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { useAccelerometer } from '@/hooks/useAccelerometer';
import { useIdleDetection } from '@/hooks/useIdleDetection';
import CircleButton from '@/components/CircleButton';
import { StepCounter } from '@/components/StepCounter';
import { StyleSheet, AppState, Image } from 'react-native';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import * as Speech from 'expo-speech';
import * as Notifications from 'expo-notifications';
import { useSettingsStore } from '@/hooks/use-settings-store';
import coach from '../../../assets/images/coach.png';



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const deferredNotify = (notificationContent?: any) => {
  if (notificationContent) {
    setTimeout(() => {
      Notifications.scheduleNotificationAsync({ content: notificationContent, trigger: null }).catch(e => console.warn('Notification error', e));
    }, 0);
  }
};

export default function HomeScreen() {
  const coords = useAccelerometer(1000);
  const [idleEnabled, setIdleEnabled] = useState(true);
  const { idleMinutes, idleSeconds, isSettingsTabActive } = useSettingsStore();
  const idleTime = (idleMinutes * 60 + idleSeconds) * 1000;
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    }
    requestPermissions();
  }, []);

    const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

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
    
  deferredNotify({ title: 'Toxic Fitness Coach', body: message, sound: true });
    
    setResetKey(k => k + 1);
  }, [getRandomMessage]);

  const handleMovement = useCallback(async () => {
    Speech.speak('Movement detected.', {
      language: 'en-GB',
      pitch: 0.9,
      rate: 0.9,
      voice: 'com.apple.voice.compact.en-GB.Daniel'
    });
    
  deferredNotify({ title: 'Movement Detected', body: 'Good job! Keep moving!', sound: true });
    
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

  const lazyBumTimeout = useRef<number | null>(null);

  const toggleIdleDetection = async () => {
    setIdleEnabled(prev => {
      const next = !prev;
      deferredNotify({ type: 'info', text1: next ? 'Idle detection turned on' : 'Idle detection turned off' });
      if (!next) {
        lazyBumTimeout.current = setTimeout(() => {
          deferredNotify({ type: 'info', text1: 'turn me on you lazy bum' });
        }, 10000);
      } else {
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
        onTimeout={useCallback(() => {
          requestAnimationFrame(() => {
            setResetKey(k => k + 1);
          });
        }, [])}
        inactive={!idleEnabled || isSettingsTabActive}
      />
      
      <StepCounter />

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
