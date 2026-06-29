import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';

export default function Login() {
  const { signIn, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    const { error } = await signIn(email.trim(), password);
    if (error) setError(error);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6 gap-4">
        <Text className="text-2xl font-bold text-brand-900">Entrar</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3"
          placeholder="E-mail" autoCapitalize="none" keyboardType="email-address"
          value={email} onChangeText={setEmail}
        />
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3"
          placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword}
        />
        {error && <Text className="text-red-600">{error}</Text>}
        <Pressable
          className="bg-brand-600 rounded-lg py-3 items-center"
          disabled={loading} onPress={onSubmit}
        >
          <Text className="text-white font-semibold">{loading ? 'Entrando...' : 'Entrar'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
