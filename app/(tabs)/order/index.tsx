import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';
import { Button, Platform, Vibration, StyleSheet, View } from 'react-native';

const Separator: React.FC = () => {
  return <ThemedView style={Platform.OS === 'android' ? styles.separator : undefined} />;
};

export default function OrderScreen() {
  const ONE_SECOND_IN_MS = 1000;

  const PATTERN: number[] = [
    1 * ONE_SECOND_IN_MS, // wait 1s
    2 * ONE_SECOND_IN_MS, // vibrate 2s
    3 * ONE_SECOND_IN_MS, // wait 3s
  ];

  const PATTERN_DESC: string =
    Platform.OS === 'android'
      ? 'wait 1s, vibrate 2s, wait 3s'
      : 'wait 1s, vibrate, wait 2s, vibrate, wait 3s';

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
        onPress={() => Vibration.vibrate(PATTERN, true)}
      />
      <Separator />

      <Button title="Stop vibration pattern" onPress={() => Vibration.cancel()} color="#FF0000" />
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
