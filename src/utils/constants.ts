export const COLORS = {
  primary: '#6C5CE7',
  primaryDark: '#5A4BD1',
  secondary: '#00CEC9',
  accent: '#FD79A8',
  success: '#00B894',
  warning: '#FDCB6E',
  danger: '#E17055',
  bgDark: '#0f0f23',
  bgCard: '#1a1a2e',
  bgInput: '#2d2d44',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textMuted: '#666680',
  border: '#2d2d44',
  vinted: '#09B1BA',
  leboncoin: '#F56B2A',
};

export const PRICING = {
  monthly: {
    id: 'vendsmoi_premium_monthly',
    price: '3,99 €',
    priceValue: 3.99,
    period: '/mois',
  },
  yearly: {
    id: 'vendsmoi_premium_yearly',
    price: '29,99 €',
    priceValue: 29.99,
    period: '/an',
    savings: '37%',
  },
};

export const CONDITIONS = [
  { label: 'Neuf avec étiquette', value: 'new_with_tags', emoji: '✨' },
  { label: 'Neuf sans étiquette', value: 'new_without_tags', emoji: '🆕' },
  { label: 'Très bon état', value: 'very_good', emoji: '👍' },
  { label: 'Bon état', value: 'good', emoji: '👌' },
  { label: 'État satisfaisant', value: 'satisfactory', emoji: '🤏' },
];
