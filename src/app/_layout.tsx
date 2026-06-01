import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '../context/AppContext';
import '../styles/global.css';

// Componente interno para gerenciar navegação baseada em Auth
const AppLayoutContent = () => {
  const { user } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Evita erros se os segmentos ainda não estiverem prontos
    if (segments.length === 0) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Redireciona para login se não estiver logado
      router.replace('/auth');
    } else if (user && inAuthGroup) {
      // Redireciona para o dashboard se logado e tentar acessar login
      router.replace('/(tabs)');
    }
  }, [user, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <AppLayoutContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}
