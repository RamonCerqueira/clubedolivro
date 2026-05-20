import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { PremiumBackground } from '@/src/components/PremiumBackground';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/components/useColorScheme';
import { Users, ChevronRight } from 'lucide-react-native';

const MOCK_CLUBS = [
  { id: '1', name: 'Leitores de Sci-Fi', members: 124, category: 'Ficção Científica' },
  { id: '2', name: 'Clássicos Imortais', members: 89, category: 'Literatura Clássica' },
  { id: '3', name: 'Fantasia Épica', members: 210, category: 'Fantasia' },
];

export default function ClubsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <PremiumBackground>
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-outfit-bold text-white mb-6">Seus Clubes</Text>

        {MOCK_CLUBS.map((club) => (
          <TouchableOpacity key={club.id} className="mb-4 rounded-2xl overflow-hidden border border-slate-800">
            <BlurView intensity={isDark ? 20 : 40} tint={isDark ? 'dark' : 'light'} className="p-4 flex-row items-center">
              <View className="w-12 h-12 bg-violet-500/20 rounded-xl items-center justify-center mr-4 border border-violet-500/30">
                <Users color="#8b5cf6" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-white font-outfit-bold text-lg">{club.name}</Text>
                <Text className="text-slate-400 font-inter text-sm">{club.category} • {club.members} membros</Text>
              </View>
              <ChevronRight color="#94a3b8" size={20} />
            </BlurView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </PremiumBackground>
  );
}
