import { ImageSourcePropType } from 'react-native';

export type GalleryCategory = 'Dogs' | 'Cats' | 'Clinic' | 'Grooming' | 'Boarding';

export interface GalleryImage {
  id: string;
  title: string;
  category: GalleryCategory;
  uri: ImageSourcePropType;
}

/** Category → creative accent color (PetsHUB red palette inspired) */
export const CATEGORY_COLORS: Record<GalleryCategory, string> = {
  Dogs: '#D31826', // brand red
  Cats: '#7C3AED', // royal purple
  Clinic: '#0EA5E9', // sky blue
  Grooming: '#10B981', // emerald
  Boarding: '#F59E0B', // amber
};

export const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  Dogs: 'Doggy Moments 🐶',
  Cats: 'Kitty Cuddles 🐱',
  Clinic: 'Clinic Care 🏥',
  Grooming: 'Spa & Groom ✨',
  Boarding: 'Boarding Buddies 🏨',
};

/**
 * Pet's Hub gallery — all captures from assets/images (skip videos).
 * Local requires so images ship with the app bundle.
 */
export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'gal-01',
    title: 'Golden Hour Furry',
    category: 'Dogs',
    uri: require('../../assets/images/ANWiy9Qt8jUH2t7DIjN4Cd8Pmaxu9xr-R4KyK01I_weGN7ZTMA2VG47xMNJe4OAF14tQfoAHQ_hYBwz2egoPMrGVjtp24IZm_Hcv4By9hZkuoDxS17LrUGF4Kdk95YSHu0e0gWGK8HYDtww1252-h1280-k-no.jpg'),
  },
  {
    id: 'gal-02',
    title: 'Whisker Whispers',
    category: 'Cats',
    uri: require('../../assets/images/ANWiy9QuaJT0LJQ1-Ny9UY6cM_Luffr4ta7v-ciLmOwFsujOH9mcaQbvbmNA9rgdk_-fyMkfGCoTgFahb3W6k_zvOZY7Sw-rZlL8Q2qfl0b2-EmbnyeAAUz0L-Xpt8tdG9L0UfTPaCTvwAw960-h1280-k-no.jpg'),
  },
  {
    id: 'gal-03',
    title: 'Clinic Care',
    category: 'Clinic',
    uri: require('../../assets/images/ANWiy9QXo2hZk-CU6iLwl_d7zlFVZnoMUCKhV2AWFqJG05tXIIwyufTWYS4DjaLx9gkEmlJas35tn32zFjLn0nbqE78I-xt3aw14oqY2gUVF5TwqFQdx8JPNIRnZei1iL-RTXV82oi-qFDpWVbcDw1242-h2208-k-no.jpg'),
  },
  {
    id: 'gal-04',
    title: 'Spa Day',
    category: 'Grooming',
    uri: require('../../assets/images/ANWiy9RTfTO9neRJJLnO61VjDW0dI6pXR1OWKY-YHBuUZoDX8Xq2KvEshtmVSRB-DsDVc0y25vGdZGolHaLbjr9zUUkTMRHt_xoVGm4UZdfyzsn00ef3eKbex-nSlMan6Mm64Ho3vLaHcAw960-h1280-k-no.jpg'),
  },
  {
    id: 'gal-05',
    title: 'Boarding Buddies',
    category: 'Boarding',
    uri: require('../../assets/images/ANWiy9Snkz6EtT5xGrdfgJ7Lji_gbLvjsoD06k4sJgD7kGxwIubTMUYx_6QoLRysi5ZDuqnNA1wnBCHN4Z8E-Jsm6ufeMhXA0PIouVx7J-QEPICEh3BDiu5nSozdB0SA4MFEYjDHYHKT2cPJ8vNFw3024-h4032-k-no.jpg'),
  },
  {
    id: 'gal-06',
    title: 'Puppy Love',
    category: 'Dogs',
    uri: require('../../assets/images/ANWiy9SVawsAzBTJxjDB0alxOLgMfjKRXvYs3HEz3W9R0vLvLqYBhRBPIBHLhhxQwWSlKaTn97VJ__eke8R3vmyNarSfOaV8Pw9Q0wHFeIpXJxJ0-vzWCkXdzIhmA5UdzE2muFoRKP-lGww635-h1280-k-no.jpg'),
  },
  {
    id: 'gal-07',
    title: 'Cat Nap',
    category: 'Cats',
    uri: require('../../assets/images/ANWiy9T3n6cSONZf63ZxJqPdZZ06xzDRrOmzjjEe3Eo4H79hS2S_xkFTwaqaDn-hgHJnIzsx2fs-M77nqCQNO2pzoWqVPQOkSSDyyc7kqqNQOVRFsYS-Pno5JDVBC5GlXXPcBHjqjRMF7Qw429-h374-k-no.jpg'),
  },
  {
    id: 'gal-08',
    title: 'Vet Visit',
    category: 'Clinic',
    uri: require('../../assets/images/ANWiy9T5XyN-NnOAuXnUIPX6jpSta0JU19PeRjyv5F7Wqzt0oT8scWBy0A03v_MFWDFPI_thU3gRlPzOZJjk94d_0EjeJLmPKsCeQ1iS0ZEwcjY-j_jMnht1K1AK-8R0SI8w09urH2-3w960-h1280-k-no.jpg'),
  },
  {
    id: 'gal-09',
    title: 'Playtime',
    category: 'Dogs',
    uri: require('../../assets/images/unnamed.jpg'),
  },
  {
    id: 'gal-10',
    title: 'Meow Moments',
    category: 'Cats',
    uri: require('../../assets/images/unnamed (1).jpg'),
  },
  {
    id: 'gal-11',
    title: 'Groomed & Glam',
    category: 'Grooming',
    uri: require('../../assets/images/unnamed (2).jpg'),
  },
];

export const GALLERY_PREVIEW = GALLERY_IMAGES.slice(0, 4);
