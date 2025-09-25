import { Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, TextInput, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState } from 'react';
import { useSettingsStore } from '@/hooks/use-settings-store';

export default function SettingsScreen() {
  const { idleMinutes, idleSeconds, setIdleMinutes, setIdleSeconds } = useSettingsStore();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <Stack.Screen options={{ title: 'Settings' }} />
        <View style={styles.inputContainer}>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(idleMinutes)}
              onChangeText={text => {
                const val = Math.max(0, parseInt(text) || 0);
                setIdleMinutes(val);
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
              }}
              placeholder="Seconds"
            />
          </View>
        </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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