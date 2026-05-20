import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { PremiumBackground } from '@/src/components/PremiumBackground';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/components/useColorScheme';
import { Award, BookOpen, Flame, Settings, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <PremiumBackground>
      <ScrollView className="flex-1">
        <View className="items-center pt-10 pb-6">
          <View className="relative">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' }} 
              className="w-28 h-28 rounded-full border-4 border-violet-500"
            />
            <View className="absolute bottom-0 right-0 bg-amber-500 rounded-full p-1 border-2 border-slate-950">
              <Award color="white" size={16} />
            </View>
          </View>
          <Text className="text-white text-2xl font-outfit-bold mt-4">Ramon Cerqueira</Text>
          <Text className="text-slate-400 font-inter">@ramon.dev</Text>
        </View>

        <View className="flex-row justify-around px-4 mb-8">
          <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} className="p-4 rounded-2xl items-center w-[30%] border border-slate-800">
            <Flame color="#f59e0b" size={24} />
            <Text className="text-white font-outfit-bold text-lg mt-1">12</Text>
            <Text className="text-slate-400 text-xs font-inter">Streak</Text>
          </BlurView>
          <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} className="p-4 rounded-2xl items-center w-[30%] border border-slate-800">
            <BookOpen color="#8b5cf6" size={24} />
            <Text className="text-white font-outfit-bold text-lg mt-1">45</Text>
            <Text className="text-slate-400 text-xs font-inter">Livros</Text>
          </BlurView>
          <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} className="p-4 rounded-2xl items-center w-[30%] border border-slate-800">
            <Award color="#ec4899" size={24} />
            <Text className="text-white font-outfit-bold text-lg mt-1">8</Text>
            <Text className="text-slate-400 text-xs font-inter">Badges</Text>
          </BlurView>
        </View>

        <View className="px-4 space-y-3">
          <TouchableOpacity className="flex-row items-center p-4 bg-slate-900/40 rounded-2xl border border-slate-800 mb-3">
            <Settings color="#94a3b8" size={20} className="mr-3" />
            <Text className="text-white font-inter flex-1">Configurações</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <LogOut color="#f43f5e" size={20} className="mr-3" />
            <Text className="text-rose-500 font-inter flex-1">Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PremiumBackground>
  );
}
