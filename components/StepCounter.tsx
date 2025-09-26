import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { ThemedView } from './themed-view';
import { FontAwesome5 } from '@expo/vector-icons';

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

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <FontAwesome5 name="walking" size={24} color="#1e90ff" style={styles.icon} />
        <View>
          <Text style={styles.stepCount}>{stepCount.toLocaleString()}</Text>
          <Text style={styles.label}>Steps Today</Text>
        </View>
      </ThemedView>
    </ThemedView>
  );
};

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
});