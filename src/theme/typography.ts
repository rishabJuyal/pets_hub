import { Fonts } from './fonts';

export const Typography = {
  h1: {
    fontSize: 20,
    fontFamily: Fonts.extraBold,
    fontWeight: '800',
    lineHeight: 26,
  },
  h2: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    lineHeight: 22,
  },
  h3: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    lineHeight: 20,
  },
  body: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    fontWeight: '400',
    lineHeight: 18,
  },
  bodySmall: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    fontWeight: '400',
    lineHeight: 16,
  },
  caption: {
    fontSize: 10.5,
    fontFamily: Fonts.medium,
    fontWeight: '500',
    lineHeight: 14,
  },
  label: {
    fontSize: 11.5,
    fontFamily: Fonts.semiBold,
    fontWeight: '600',
    lineHeight: 16,
  },
  button: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    lineHeight: 18,
  },
} as const;
