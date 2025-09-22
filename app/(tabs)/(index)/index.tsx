import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

type Coordinates = {
  x: number;
  y: number;
  z: number;
};






export default function HomeScreen() {

    const [{ x, y, z }, setData] = useState<Coordinates>({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(() => {
    Accelerometer.setUpdateInterval(2000);
    const subscription = Accelerometer.addListener(setData);
    return () => subscription.remove();
  }, []);

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen
        options={{ title: "Toxic Fitness Coach" }}
        
        
      />
      <ThemedText>x: {x}</ThemedText>
      <ThemedText>y: {y}</ThemedText>
      <ThemedText>z: {z}</ThemedText>
    </ThemedView>
  );

}
