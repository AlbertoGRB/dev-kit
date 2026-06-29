/**
 * Layout raiz — ordem de inicialização crítica:
 *   setupNetworkManager() → QueryClient → PersistQueryClientProvider
 *   → AuthGate.initialize() → sessão restaurada → queries habilitadas
 *
 * Padrão extraído do projeto de referência AppExemplo Mobile.
 */
import '../global.css';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/authStore';
import { flushOutbox } from '@/lib/sync';
import { setupNetworkManager } from '@/lib/network';
import { logger } from '@/lib/logger';

// Integra rede ↔ TanStack Query antes de tudo
setupNetworkManager();

const TAG = 'RootLayout';

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1_000,
  key: 'app-query-cache-v1',
});

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { session, initialized, initialize } = useAuthStore();

  useEffect(() => {
    logger.info(TAG, 'AuthGate montado — inicializando sessão');
    initialize();
  }, [initialize]);

  // Sync engine: flush da outbox ao logar e a cada 30s
  useEffect(() => {
    if (!session) return;
    flushOutbox().catch(() => {});
    const id = setInterval(() => flushOutbox().catch(() => {}), 30_000);
    return () => clearInterval(id);
  }, [session]);

  // Redireciona conforme estado de auth (só após inicializar)
  useEffect(() => {
    if (!initialized) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) router.replace('/(auth)/login');
    else if (session && inAuthGroup) router.replace('/(app)');
  }, [initialized, session, segments, router]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium });
  if (!fontsLoaded) return <View style={{ flex: 1 }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 * 7 }}
        >
          <AuthGate />
          <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
          <StatusBar style="light" />
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
