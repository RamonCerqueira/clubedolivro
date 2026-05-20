import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { PremiumBackground } from '@/src/components/PremiumBackground';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '@/src/store/auth-store';
import { router } from 'expo-router';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = () => {
    // Mock login
    setAuth({ id: '1', name: 'Ramon', email: 'ramon@dev.com' }, 'mock-token');
    router.replace('/(tabs)');
  };

  return (
    <PremiumBackground>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="items-center mb-10">
          <Text className="text-4xl font-outfit-bold text-white">Clube do <Text className="text-violet-500">Livro</Text></Text>
          <Text className="text-slate-400 font-inter mt-2">Sua jornada literária começa aqui.</Text>
        </View>

        <BlurView intensity={30} tint="dark" className="p-6 rounded-3xl border border-slate-800 overflow-hidden">
          <View className="space-y-4">
            <View className="flex-row items-center bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3 mb-4">
              <Mail color="#64748b" size={20} className="mr-3" />
              <TextInput 
                placeholder="Email" 
                placeholderTextColor="#64748b"
                className="flex-1 text-white font-inter"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="flex-row items-center bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3 mb-6">
              <Lock color="#64748b" size={20} className="mr-3" />
              <TextInput 
                placeholder="Senha" 
                placeholderTextColor="#64748b"
                secureTextEntry
                className="flex-1 text-white font-inter"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity 
              onPress={handleLogin}
              className="bg-violet-600 rounded-2xl py-4 flex-row items-center justify-center"
            >
              <Text className="text-white font-outfit-bold text-lg mr-2">Entrar</Text>
              <ArrowRight color="white" size={20} />
            </TouchableOpacity>
          </View>
        </BlurView>

        <TouchableOpacity className="mt-8 items-center" onPress={() => router.push('/auth/register')}>
          <Text className="text-slate-400 font-inter">Não tem uma conta? <Text className="text-violet-400 font-inter-bold">Cadastre-se</Text></Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </PremiumBackground>
  );
}
