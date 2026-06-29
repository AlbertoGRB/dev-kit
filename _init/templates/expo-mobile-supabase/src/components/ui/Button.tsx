import { Pressable, Text, ActivityIndicator } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onPress, loading, variant = 'primary' }: Props) {
  const bg = variant === 'primary' ? 'bg-brand-600' : 'bg-gray-200';
  const fg = variant === 'primary' ? 'text-white' : 'text-gray-800';
  return (
    <Pressable className={`${bg} rounded-lg py-3 items-center`} disabled={loading} onPress={onPress}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text className={`${fg} font-semibold`}>{label}</Text>}
    </Pressable>
  );
}
