import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { AppText } from './AppText';
import { Colors } from '../theme/colors';
import { Radius } from '../theme/radius';
import { Typography } from '../theme/typography';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';

interface ButtonProps {
  title?: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: any;
  textStyle?: any;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}) => {
  const variantStyles: Record<string, any> = {
    primary: { backgroundColor: Colors.primary },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.border,
    },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: Colors.danger },
  };

  const textColor =
    variant === 'outline' || variant === 'ghost'
      ? variant === 'outline'
        ? Colors.primary
        : Colors.textPrimary
      : Colors.textWhite;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        variantStyles[variant],
        disabled && styles.disabled,
        style,
      ]}
      onPress={(!disabled && !loading) ? onPress : undefined}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} style={styles.loading} />
      ) : (
        <>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <AppText variant="button" style={[styles.text, { color: textColor }, textStyle]}>
            {title}
          </AppText>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.md,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: Typography.button.fontSize,
    fontWeight: Typography.button.fontWeight,
  },
  iconWrapper: {
    marginRight: 6,
  },
  loading: {
    marginLeft: 6,
  },
});
