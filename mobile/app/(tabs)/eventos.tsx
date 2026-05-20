import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { PremiumBackground } from '@/src/components/PremiumBackground';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/components/useColorScheme';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react-native';

const MOCK_EVENTS = [
  { id: '1', title: 'Discussão: O Nome do Vento', date: 'Hoje, 19:30', location: 'Discord (Online)' },
  { id: '2', title: 'Encontro Mensal - Ficção', date: 'Amanhã, 18:00', location: 'Livraria Central' },
];

export default function EventsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <PremiumBackground>
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-outfit-bold text-white mb-6">Próximos Eventos</Text>

        {MOCK_EVENTS.map((event) => (
          <View key={event.id} className="mb-4 rounded-2xl overflow-hidden border border-slate-800">
            <BlurView intensity={isDark ? 20 : 40} tint={isDark ? 'dark' : 'light'} className="p-4">
              <Text className="text-white font-outfit-bold text-lg mb-2">{event.title}</Text>
              <View className="flex-row items-center mb-1">
                <CalendarIcon color="#8b5cf6" size={16} className="mr-2" />
                <Text className="text-slate-400 font-inter text-sm">{event.date}</Text>
              </View>
              <View className="flex-row items-center">
                <MapPin color="#ec4899" size={16} className="mr-2" />
                <Text className="text-slate-400 font-inter text-sm">{event.location}</Text>
              </View>
            </BlurView>
          </View>
        ))}
      </ScrollView>
    </PremiumBackground>
  );
}
