import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Typography } from '../theme/typography';
import { Fonts } from '../theme/fonts';

type TextVariant = keyof typeof Typography;

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  italic?: boolean;
}

export const AppText: React.FC<AppTextProps> = ({
  children,
  variant = 'body',
  italic = false,
  style,
  ...props
}) => {
  const base = Typography[variant];
  const fontFamily = italic
    ? (() => {
        switch (variant) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'button':
            return Fonts.boldItalic;
          case 'caption':
          case 'label':
            return Fonts.semiBoldItalic;
          default:
            return Fonts.regularItalic;
        }
      })()
    : base.fontFamily;

  const flatStyle = StyleSheet.flatten(style) as any;
  const customFontSize = flatStyle?.fontSize;
  const computedLineHeight = flatStyle?.lineHeight
    ? flatStyle.lineHeight
    : customFontSize
    ? Math.round(customFontSize * 1.35)
    : base.lineHeight;

  return (
    <Text
      style={[
        {
          fontFamily,
          fontSize: base.fontSize,
          fontWeight: base.fontWeight,
          lineHeight: computedLineHeight,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({});
