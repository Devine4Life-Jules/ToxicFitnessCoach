import { View, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

type Props = {
  onPress: () => void;
  idleEnabled: boolean;
};

export default function CircleButton({ onPress, idleEnabled }: Props) {
  const handlePress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onPress();
  };

  return (
    <View style={styles.circleButtonContainer}>
      <Pressable
        style={[
          styles.circleButton,
          { backgroundColor: idleEnabled ? '#91faa2ff' : '#f96969ff' },
        ]}
        onPress={handlePress}
      >
        <MaterialIcons name="sports" size={38} color="#25292e" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 84,
    height: 84,
    marginHorizontal: 60,
    borderWidth: 4,
    borderColor: '#ffd33d',
    borderRadius: 42,
    padding: 3,
  },
  circleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
  },
});
