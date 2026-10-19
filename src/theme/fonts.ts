export const Fonts = {
  regular: 'DMSans_400Regular',
  regularItalic: 'DMSans_400Regular_Italic',
  medium: 'DMSans_500Medium',
  mediumItalic: 'DMSans_500Medium_Italic',
  semiBold: 'DMSans_600SemiBold',
  semiBoldItalic: 'DMSans_600SemiBold_Italic',
  bold: 'DMSans_700Bold',
  boldItalic: 'DMSans_700Bold_Italic',
  extraBold: 'DMSans_800ExtraBold',
  black: 'DMSans_900Black',
} as const;

export type FontWeight = keyof typeof Fonts;
