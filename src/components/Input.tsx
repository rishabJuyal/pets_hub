import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Colors } from '../theme/colors';
import { Radius } from '../theme/radius';
import { Typography } from '../theme/typography';

type IconName = keyof typeof Ionicons.glyphMap;

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  keyboardType?: any;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
  containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  keyboardType,
  multiline = false,
  numberOfLines = 1,
  style,
  containerStyle,
}) => {
  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <AppText variant="caption" style={styles.label}>
          {label}
        </AppText>
      )}

      <View style={[styles.inputRow, hasError && styles.errorBorder]}>
        {leftIcon && (
          <Ionicons name={leftIcon} size={18} color={Colors.primary} style={styles.icon} />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
        {rightIcon && (
          <Ionicons
            name={rightIcon}
            size={18}
            color={Colors.textMuted}
            style={[styles.icon, onRightIconPress && styles.iconPressable]}
          />
        )}
      </View>

      {error && (
        <AppText variant="caption" style={styles.errorText}>
          {error}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  errorBorder: {
    borderColor: Colors.danger,
  },
  icon: {
    marginRight: 8,
  },
  iconPressable: {
    // keep pressable feel
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: undefined as any,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
  },
});
