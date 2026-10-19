import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { Colors } from '../theme/colors';

type BadgeVariant =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'low_stock';

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
}

const CONFIG: Record<string, { bg: string; text: string; dot?: string }> = {
  pending: { bg: Colors.statusPendingBg, text: Colors.statusPendingText, dot: Colors.statusPendingDot },
  confirmed: { bg: Colors.statusConfirmedBg, text: Colors.statusConfirmedText, dot: Colors.statusConfirmedDot },
  completed: { bg: Colors.statusCompletedBg, text: Colors.statusCompletedText, dot: Colors.statusCompletedDot },
  cancelled: { bg: Colors.statusCancelledBg, text: Colors.statusCancelledText, dot: Colors.statusCancelledDot },
  low_stock: { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' },
  primary: { bg: Colors.primary, text: Colors.textWhite },
  success: { bg: Colors.successBg, text: Colors.success, dot: Colors.success },
  warning: { bg: Colors.warningBg, text: Colors.warning, dot: Colors.warning },
  danger: { bg: Colors.dangerBg, text: Colors.danger, dot: Colors.danger },
};

export const Badge: React.FC<BadgeProps> = ({ variant, label }) => {
  const config = CONFIG[variant] || CONFIG.primary;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      {config.dot && <View style={[styles.dot, { backgroundColor: config.dot }]} />}
      <AppText variant="caption" style={[styles.label, { color: config.text }]}>
        {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
  },
});
