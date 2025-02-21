const path = require("path")
const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")
const generatePalette = require(path.resolve(
  __dirname,
  "angular/src/@luxstart/tailwind/utils/generate-palette"
))

/**
 * Custom palettes
 *
 * Uses the generatePalette helper method to generate
 * Tailwind-like color palettes automatically
 */
const customPalettes = {
  brand: generatePalette("#2196F3"),
}

/**
 * Themes
 */
const themes = {
  // Default theme is required for theming system to work correctly!
  default: {
    primary: {
      ...colors.indigo,
      DEFAULT: colors.indigo[800],
    },
    accent: {
      ...colors.slate,
      DEFAULT: colors.slate[800],
    },
    warn: {
      ...colors.red,
      DEFAULT: colors.red[600],
    },
    "on-warn": {
      500: colors.red["50"],
    },
  },
  // Rest of the themes will use the 'default' as the base
  // theme and will extend it with their given configuration.
  brand: {
    primary: customPalettes.brand,
  },
  teal: {
    primary: {
      ...colors.teal,
      DEFAULT: colors.teal[700],
    },
  },
  rose: {
    primary: {
      ...colors.rose,
      DEFAULT: colors.rose[400],
    },
  },
  purple: {
    primary: {
      ...colors.purple,
      DEFAULT: colors.purple[600],
    },
  },
  amber: {
    primary: {
      ...colors.amber,
      DEFAULT: colors.amber[900],
    },
  },
  // white: {
  //     primary: {
  //         ...colors.gray,
  //         DEFAULT: colors.gray[50],
  //     },
  // },
}

module.exports = {
  content: [
    './angular/src/**/*.{html,js,scss}',
    './index.html',
  ],
  important: true,
  theme: {
    darkMode: ['class'], // Kích hoạt theo class hoặc data-theme
    screens: {
      'xs': '320px',
      // => @media (min-width: 320px) { ... }

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        accent: '#5A46D7',
        default: '#5A46D7',
        primary: '#5A46D7',
        warn: colors.red[600]
      },
      animation: {
        fadein: 'fadein 1s linear 1s forwards',
      },
      keyframes: {
        fadein: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    // require("./plugin"),
    // Fuse - Tailwind plugins
    require(path.resolve(
      __dirname,
      "angular/src/@luxstart/tailwind/plugins/utilities"
    )),
    require(path.resolve(
      __dirname,
      "angular/src/@luxstart/tailwind/plugins/icon-size"
    )),
    require(path.resolve(__dirname, "angular/src/@luxstart/tailwind/plugins/theming"))({
      themes,
    }),
  ],
}
