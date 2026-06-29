import { Stack } from 'expo-router';
import { View } from 'react-native';
import { NetworkBanner } from '@/components/ui';

export default function AppLayout() {
  return (
    <View className="flex-1">
      <NetworkBanner />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
