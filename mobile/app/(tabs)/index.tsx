import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { PremiumBackground } from '@/src/components/PremiumBackground';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/components/useColorScheme';
import { Bookmark, Heart, MessageCircle } from 'lucide-react-native';

const MOCK_BOOKS = [
  {
    id: '1',
    title: 'O Nome do Vento',
    author: 'Patrick Rothfuss',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200',
    description: 'Um jovem prodígio em busca de vingança e conhecimento.',
  },
  {
    id: '2',
    title: 'Duna',
    author: 'Frank Herbert',
    cover: 'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?auto=format&fit=crop&q=80&w=200',
    description: 'Uma épica jornada em um mundo de areia e especiaria.',
  },
];

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <PremiumBackground>
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="mb-6">
          <Text className="text-3xl font-outfit-bold text-violet-500 mb-1">Olá, Leitor!</Text>
          <Text className="text-slate-400 font-inter">Confira as novidades do seu clube.</Text>
        </View>

        {MOCK_BOOKS.map((book) => (
          <TouchableOpacity key={book.id} className="mb-6 overflow-hidden rounded-2xl border border-slate-800">
            <BlurView intensity={isDark ? 30 : 50} tint={isDark ? 'dark' : 'light'} className="p-4 flex-row">
              <Image source={{ uri: book.cover }} className="w-24 h-36 rounded-lg mr-4" />
              <View className="flex-1 justify-between py-1">
                <View>
                  <Text className="text-white text-xl font-outfit-bold">{book.title}</Text>
                  <Text className="text-violet-400 font-inter">{book.author}</Text>
                  <Text className="text-slate-400 font-inter text-sm mt-2" numberOfLines={2}>
                    {book.description}
                  </Text>
                </View>
                
                <View className="flex-row items-center space-x-4 mt-2">
                  <Heart color="#94a3b8" size={20} />
                  <MessageCircle color="#94a3b8" size={20} />
                  <Bookmark color="#94a3b8" size={20} />
                </View>
              </View>
            </BlurView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </PremiumBackground>
  );
}
