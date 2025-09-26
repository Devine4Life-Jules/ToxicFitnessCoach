import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Platform, Vibration } from 'react-native';

interface CountdownTimerProps {
  duration: number; // ms
  resetTrigger: any; // change this value to reset timer
  onTimeout: () => void;
  inactive?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ duration, resetTrigger, onTimeout, inactive }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [hasVibrated, setHasVibrated] = useState(false);

  useEffect(() => {
    setTimeLeft(duration);
    setHasVibrated(false);
  }, [resetTrigger, duration]);

  useEffect(() => {
    let timeoutId: number;
    
    if (inactive) {
      requestAnimationFrame(() => {
        setTimeLeft(duration);
        setHasVibrated(false);
      });
      return;
    }
    
    if (timeLeft <= 0) {
      if (!hasVibrated) {
        // Strong vibration pattern
        if (Platform.OS === 'android') {
          Vibration.vibrate([0, 1000, 500, 1000]);
        } else {
          Vibration.vibrate(1500);
        }
        setHasVibrated(true);
      }
      // Schedule onTimeout callback
      timeoutId = requestAnimationFrame(() => {
        onTimeout();
      });
      return () => cancelAnimationFrame(timeoutId);
    }
    
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1000);
    }, 1000);
    
    return () => {
      clearInterval(interval);
      if (timeoutId) {
        cancelAnimationFrame(timeoutId);
      }
    };
  }, [timeLeft, onTimeout, inactive, duration, hasVibrated]);

  const seconds = Math.max(0, Math.floor((timeLeft / 1000) % 60));
  const minutes = Math.max(0, Math.floor(timeLeft / 60000));
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return <Text style={[styles.chrono, inactive && styles.inactive]}>{formatted}</Text>;
};

const styles = StyleSheet.create({
  chrono: {
    fontSize: 48,
    textAlign: 'center',
    marginVertical: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#1e90ff',
    backgroundColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    opacity: 1,
  },
  inactive: {
    color: '#888',
    backgroundColor: '#333',
    opacity: 0.5,
  },
});

export default CountdownTimer;
