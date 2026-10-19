import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from './AppText';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionTitle?: string;
  onActionPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionTitle,
  onActionPress,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <AppText variant="h3" style={[styles.title, { color: Colors.textPrimary }]}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="bodySmall" style={[styles.subtitle, { color: Colors.textSecondary }]}>
            {subtitle}
          </AppText>
        )}
      </View>
      {actionTitle && onActionPress && (
        <TouchableOpacity onPress={onActionPress} activeOpacity={0.8}>
          <AppText variant="label" style={[styles.action, { color: Colors.primary }]}>
            {actionTitle}
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
  action: {
    fontSize: 12,
    fontWeight: '600',
  },
});
