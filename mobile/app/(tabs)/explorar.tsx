import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { PremiumBackground } from '@/src/components/PremiumBackground';
import { Search } from 'lucide-react-native';
import { useColorScheme } from '@/components/useColorScheme';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <PremiumBackground>
      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-center bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3 mb-6">
          <Search color="#94a3b8" size={20} className="mr-2" />
          <TextInput 
            placeholder="Buscar livros, clubes ou autores..." 
            placeholderTextColor="#64748b"
            className="flex-1 text-white font-inter"
          />
        </View>

        <Text className="text-xl font-outfit-bold text-white mb-4">Categorias em Alta</Text>
        <View className="flex-row flex-wrap gap-3">
          {['Ficção', 'Romance', 'Terror', 'Suspense', 'Biografia', 'História'].map((cat) => (
            <View key={cat} className="px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
              <Text className="text-slate-300 font-inter">{cat}</Text>
            </View>
          ))}
        </View>
      </View>
    </PremiumBackground>
  );
}
