import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';
import { Button, Platform, Vibration, StyleSheet, View } from 'react-native';
import { useRef } from 'react';

const Separator: React.FC = () => {
  return <ThemedView style={Platform.OS === 'android' ? styles.separator : undefined} />;
};

export default function OrderScreen() {
  const ONE_SECOND_IN_MS = 1000;

  const PATTERN: number[] = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    3 * ONE_SECOND_IN_MS,
  ];

  const PATTERN_DESC: string =
    Platform.OS === 'android'
      ? 'wait 1s, vibrate 2s, wait 3s'
      : 'wait 1s, vibrate, wait 2s, vibrate, wait 3s';

  // Ref to store the interval ID for iOS
  const iosInterval = useRef<NodeJS.Timer | null>(null);

  const startIOSVibration = () => {
    if (iosInterval.current) return; // already running
    iosInterval.current = setInterval(() => {
      Vibration.vibrate(500); // vibrate for 0.5s repeatedly
    }, 500);
  };

  const stopIOSVibration = () => {
    if (iosInterval.current) {
      clearInterval(iosInterval.current);
      iosInterval.current = null;
    }
    Vibration.cancel(); // ensure vibration stops immediately
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: 'Vibration Menu' }} />

      <ThemedText>Hallo</ThemedText>

      <View style={{ marginTop: 24 }}>
        <Button title="Vibrate once" onPress={() => Vibration.vibrate()} />
      </View>

      <Separator />

      {Platform.OS === 'android' && (
        <>
          <View>
            <Button
              title="Vibrate for 10 seconds"
              onPress={() => Vibration.vibrate(10 * ONE_SECOND_IN_MS)}
            />
          </View>
          <Separator />
        </>
      )}

      <ThemedText style={styles.paragraph}>Pattern: {PATTERN_DESC}</ThemedText>

      <Button title="Vibrate with pattern" onPress={() => Vibration.vibrate(PATTERN)} />
      <Separator />

      <Button
        title="Vibrate with pattern until cancelled"
        onPress={() =>
          Platform.OS === 'android'
            ? Vibration.vibrate(PATTERN, true)
            : startIOSVibration()
        }
      />
      <Separator />

      <Button
        title="Stop vibration pattern"
        onPress={stopIOSVibration}
        color="#FF0000"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    marginVertical: 16,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
