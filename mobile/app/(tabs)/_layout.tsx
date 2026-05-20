import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Compass, Users, Calendar, User } from 'lucide-react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8b5cf6",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#020617' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#1e293b' : '#e2e8f0',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#020617' : '#ffffff',
        },
        headerTitleStyle: {
          fontFamily: 'Outfit-Bold',
          color: colorScheme === 'dark' ? '#f8fafc' : '#020617',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="explorar"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="clubes"
        options={{
          title: 'Clubes',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="eventos"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

