import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';

export default function Home() {
  const { profile, signOut } = useAuthStore();
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 pt-6 gap-4">
        <Text className="text-2xl font-bold text-brand-900">
          Olá{profile?.name ? `, ${profile.name}` : ''}
        </Text>
        <Text className="text-gray-600">
          Tela inicial do template. Substitua pelo conteúdo do seu app.
        </Text>
        <Pressable className="bg-gray-200 rounded-lg py-3 items-center mt-auto mb-6" onPress={signOut}>
          <Text className="font-semibold text-gray-800">Sair</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
