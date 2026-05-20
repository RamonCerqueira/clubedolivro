import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { PremiumBackground } from '@/src/components/PremiumBackground';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <PremiumBackground>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6"
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>

          <View className="mb-10">
            <Text className="text-4xl font-outfit-bold text-white">Criar <Text className="text-violet-500">Conta</Text></Text>
            <Text className="text-slate-400 font-inter mt-2">Faça parte da maior comunidade de leitores.</Text>
          </View>

          <BlurView intensity={30} tint="dark" className="p-6 rounded-3xl border border-slate-800 overflow-hidden">
            <View className="space-y-4">
              <View className="flex-row items-center bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3 mb-4">
                <User color="#64748b" size={20} className="mr-3" />
                <TextInput 
                  placeholder="Nome Completo" 
                  placeholderTextColor="#64748b"
                  className="flex-1 text-white font-inter"
                  value={name}
                  onChangeText={setName}
                />
              </View>

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
                className="bg-violet-600 rounded-2xl py-4 items-center justify-center"
              >
                <Text className="text-white font-outfit-bold text-lg">Criar Minha Conta</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </PremiumBackground>
  );
}
