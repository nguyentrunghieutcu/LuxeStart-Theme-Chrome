export interface ZodiacGradient {
  light: string;
  dark: string;
}

export const zodiacColors: Record<string, ZodiacGradient> = {
  'aries': {
    light: 'linear-gradient(135deg, #FFF5F5, #FED7D7)',
    dark: 'linear-gradient(135deg, #FF4D4D, #FF8080)'
  },
  'taurus': {
    light: 'linear-gradient(135deg, #F0FFF4, #C6F6D5)',
    dark: 'linear-gradient(135deg, #4CAF50, #81C784)'
  },
  'gemini': {
    light: 'linear-gradient(135deg, #FFFFF0, #FEFCBF)',
    dark: 'linear-gradient(135deg, #FFC107, #FFE082)'
  },
  'cancer': {
    light: 'linear-gradient(135deg, #E6FFFA, #B2F5EA)',
    dark: 'linear-gradient(135deg, #00BCD4, #80DEEA)'
  },
  'leo': {
    light: 'linear-gradient(135deg, #FFFAF0, #FEEBC8)',
    dark: 'linear-gradient(135deg, #FF9800, #FFB74D)'
  },
  'virgo': {
    light: 'linear-gradient(135deg, #FAF5FF, #E9D8FD)',
    dark: 'linear-gradient(135deg, #9C27B0, #BA68C8)'
  },
  'libra': {
    light: 'linear-gradient(135deg, #EBF4FF, #C3DAFE)',
    dark: 'linear-gradient(135deg, #3F51B5, #7986CB)'
  },
  'scorpio': {
    light: 'linear-gradient(135deg, #FFF5F7, #FED7E2)',
    dark: 'linear-gradient(135deg, #E91E63, #F06292)'
  },
  'sagittarius': {
    light: 'linear-gradient(135deg, #F3E8FF, #E9D5FF)',
    dark: 'linear-gradient(135deg, #673AB7, #9575CD)'
  },
  'capricorn': {
    light: 'linear-gradient(135deg, #EFEBE9, #D7CCC8)',
    dark: 'linear-gradient(135deg, #795548, #A1887F)'
  },
  'aquarius': {
    light: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
    dark: 'linear-gradient(135deg, #2196F3, #64B5F6)'
  },
  'pisces': {
    light: 'linear-gradient(135deg, #E0F2F1, #B2DFDB)',
    dark: 'linear-gradient(135deg, #009688, #4DB6AC)'
  }
};