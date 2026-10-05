import { TEMPLATE_LIST, COLOR_PALETTES } from '../types/resume';

export const templateService = {
  getTemplates: () => TEMPLATE_LIST,
  getColorPalettes: () => COLOR_PALETTES,

  getFontFamilyClass: (fontKey) => {
    switch (fontKey) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'sans':
      default:
        return 'font-sans';
    }
  },

  getFontSizeClass: (sizeKey) => {
    switch (sizeKey) {
      case 'compact':
        return 'text-xs leading-relaxed';
      case 'large':
        return 'text-base leading-relaxed';
      case 'normal':
      default:
        return 'text-sm leading-relaxed';
    }
  }
};
