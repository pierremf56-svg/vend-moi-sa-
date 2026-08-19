import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

export const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);

export const copyToClipboard = async (text: string, label: string) => {
  await Clipboard.setStringAsync(text);
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  Toast.show({
    type: 'success',
    text1: '✅ Copié !',
    text2: `${label} copié dans le presse-papiers`,
    visibilityTime: 2000,
  });
};

export const getTimeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${days}j`;
};
