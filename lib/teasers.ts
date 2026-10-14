import { ImageSourcePropType } from 'react-native';
import { LifelistEntry } from './types';

export type Teaser = {
  key: string;
  /** Matched as a whole word against found species names ("Red Fox" finds the fox). */
  word: string;
  image: ImageSourcePropType;
};

/**
 * The "Not found yet" cards that follow the user's own finds on Home, using
 * the animal photos from Figma (Home 88384:2943). Each disappears once the
 * life list holds a species with its animal in the name.
 */
export const TEASERS: Teaser[] = [
  { key: 'squirrel', word: 'squirrel', image: require('../assets/lifelist/squirrel.jpg') },
  { key: 'wolf', word: 'wolf', image: require('../assets/lifelist/wolf.jpg') },
  { key: 'deer', word: 'deer', image: require('../assets/lifelist/deer.jpg') },
  { key: 'raccoon', word: 'raccoon', image: require('../assets/lifelist/raccoon.jpg') },
  { key: 'lion', word: 'lion', image: require('../assets/lifelist/lion.jpg') },
  { key: 'bat', word: 'bat', image: require('../assets/lifelist/bat.jpg') },
  { key: 'fox', word: 'fox', image: require('../assets/lifelist/fox.jpg') },
  { key: 'snake', word: 'snake', image: require('../assets/lifelist/snake.jpg') },
  { key: 'rat', word: 'rat', image: require('../assets/lifelist/rat.jpg') },
];

export function teasersStillHidden(entries: LifelistEntry[]): Teaser[] {
  return TEASERS.filter((teaser) => {
    const pattern = new RegExp(`\\b${teaser.word}(e?s)?\\b`, 'i');
    return !entries.some((entry) => pattern.test(entry.commonName));
  });
}
