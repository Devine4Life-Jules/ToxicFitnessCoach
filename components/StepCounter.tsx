import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { FontAwesome5 } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export const StepCounter = () => {
  const [stepCount, setStepCount] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const updateStepCount = async () => {
      try {
        const currentSteps = await Pedometer.getStepCountAsync(startOfToday, new Date());
        setStepCount(currentSteps?.steps ?? 0);
      } catch (error) {
        console.warn('Failed to update step count:', error);
      }
    };

    const subscribe = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(isAvailable);

        if (isAvailable) {
          // Initial step count
          await updateStepCount();
          
          // Poll every 10 seconds to ensure accuracy
          pollInterval = setInterval(updateStepCount, 10000);

          // Subscribe to pedometer updates
          subscription = Pedometer.watchStepCount(result => {
            // Get current steps again to ensure accuracy
            Pedometer.getStepCountAsync(startOfToday, new Date())
              .then(currentSteps => {
                setStepCount(currentSteps?.steps ?? 0);
              })
              .catch(error => {
                console.warn('Failed to get current step count:', error);
              });
          });
        }
      } catch (error) {
        console.warn('Pedometer setup failed:', error);
      }
    };

    subscribe();

    return () => {
      subscription?.remove();
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, []);

  if (!isPedometerAvailable) {
    return null;
  }

  const handleReset = () => {
    setStepCount(0);
    // Defer toast to avoid updating during render
    requestAnimationFrame(() => {
      try {
        Toast.show({
          type: 'info',
          text1: 'Step counter reset',
          text2: 'Starting fresh!',
        });
      } catch (e) {
        console.warn('Toast error', e);
      }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <FontAwesome5 name="walking" size={24} color="#1e90ff" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.stepCount}>{stepCount.toLocaleString()}</Text>
          <Text style={styles.label}>Steps Today</Text>
          <ThemedText style={styles.message}>{getCoachMessage(stepCount)}</ThemedText>
        </View>
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <FontAwesome5 name="redo" size={16} color="#666" />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

function getCoachMessage(steps: number) {
  // Messages get more negative the fewer steps you have, but never fully positive
  if (steps < 500) return "What is that? A napathon? Try walking, human.";
  if (steps < 2000) return "Cute. That's not a workout, it's a warmup. Do better.";
  if (steps < 5000) return "Meh. You're moving... barely. Try harder.";
  if (steps < 10000) return "Alright, not awful. Don't get a big head though.";
  return "Okay, you're moving. Still not impressed, but I'll tolerate it.";
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  resetButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#333',
    marginLeft: 16,
  },
  icon: {
    marginRight: 16,
  },
  stepCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  message: {
    marginTop: 6,
    color: '#ccc',
    fontSize: 13,
  },
});