import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="(index)"
        options={{
          title: 'home',
          tabBarIcon: ({ color, focused }) => <Ionicons size={28} name={focused ? 'barbell' : 'barbell-outline'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => <Ionicons size={28} name={focused ? 'settings' : 'settings-outline'} color={color} />,
        }}
      />
    </Tabs>
  );
}
