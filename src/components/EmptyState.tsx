import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Button } from './Button';

type IconName = keyof typeof Ionicons.glyphMap;

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  subtitle?: string;
  buttonTitle?: string;
  onPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'information-circle',
  title,
  subtitle,
  buttonTitle,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      {icon && (
        <Ionicons name={icon} size={64} color={Colors.textMuted} style={styles.icon} />
      )}
      <AppText variant="h3" style={[styles.title, { color: Colors.textPrimary }]}>
        {title}
      </AppText>
      {subtitle && (
        <AppText variant="bodySmall" style={[styles.subtitle, { color: Colors.textSecondary }]}>
          {subtitle}
        </AppText>
      )}
      {buttonTitle && onPress && (
        <Button
          title={buttonTitle}
          onPress={onPress}
          variant="outline"
          fullWidth
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  button: {
    width: '60%',
    marginTop: 8,
  },
});
