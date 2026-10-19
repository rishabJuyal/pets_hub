import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface ScreenProps {
  children: React.ReactNode;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: any;
  style?: any;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  scrollable?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  style,
  keyboardShouldPersistTaps = 'handled',
  scrollable = true,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }, style]}>
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, styles.nonScrollContent, contentContainerStyle]}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 36,
  },
  nonScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
});
