import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { onlineManager } from '@tanstack/react-query';
import { flushOutbox } from '@/lib/sync';
import { useOutbox } from '@/stores/outboxStore';

export function NetworkBanner() {
  const [online, setOnline] = useState(onlineManager.isOnline());
  const pending = useOutbox((s) => s.ops.length);
  useEffect(() => onlineManager.subscribe(setOnline), []);

  if (online && pending === 0) return null;
  return (
    <View className={`px-4 py-2 ${online ? 'bg-amber-100' : 'bg-gray-200'}`}>
      <Text className="text-xs text-gray-800">
        {online ? `${pending} pendência(s) para enviar` : 'Sem conexão — trabalhando offline'}
      </Text>
      {online && pending > 0 && (
        <Pressable onPress={() => flushOutbox().catch(() => {})}>
          <Text className="text-xs font-semibold text-brand-600">Enviar agora</Text>
        </Pressable>
      )}
    </View>
  );
}
