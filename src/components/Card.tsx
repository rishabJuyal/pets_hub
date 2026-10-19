import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius } from '../theme/radius';
import { Shadow } from '../theme/shadows';

interface CardProps {
  children: React.ReactNode;
  padding?: number;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  style?: any;
  backgroundColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 16,
  shadow = 'sm',
  style,
  backgroundColor,
}) => {
  return (
    <View
      style={[
        styles.card,
        shadow !== 'none' && Shadow[shadow],
        { backgroundColor, padding },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
  },
});
