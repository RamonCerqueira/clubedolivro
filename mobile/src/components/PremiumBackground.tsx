import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/components/useColorScheme';

export function PremiumBackground({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1 bg-[#020617]">
      <LinearGradient
        colors={isDark 
          ? ['#020617', '#0f172a', '#020617'] 
          : ['#f8fafc', '#e2e8f0', '#f8fafc']}
        className="flex-1"
      >
        <View style={StyleSheet.absoluteFill}>
          {/* Subtle accent glows */}
          <LinearGradient
            colors={['rgba(139, 92, 246, 0.1)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 0.5 }}
            style={{ position: 'absolute', width: '100%', height: '50%' }}
          />
          <LinearGradient
            colors={['rgba(236, 72, 153, 0.08)', 'transparent']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0.5, y: 0.5 }}
            style={{ position: 'absolute', width: '100%', height: '50%' }}
          />
        </View>
        {children}
      </LinearGradient>
    </View>
  );
}
