const fs = require('fs');
const path = require('path');

// Create the directory if it doesn't exist
const soundsDir = path.join(__dirname, 'angular', 'src', 'assets', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// List of placeholder images to create
const placeholders = [
  'ocean.webp',
  'rainfall.webp',
  'thunderstorm.webp',
  'atmospheric.webp',
  'beats-to-think.webp',
  'mellow-beats.webp',
  'lofi-hip-hop.webp',
  'lush-lofi.webp',
  'jazz-background.webp',
  'piano-background.webp',
  'ny-coffee.webp',
  'study-with-me.webp'
];

// Create a simple SVG for each placeholder
placeholders.forEach((filename) => {
  const name = path.basename(filename, path.extname(filename));
  const color = getRandomColor();
  
  // Create a simple SVG with the name text
  const svgContent = `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="${color}" />
  <text x="100" y="100" font-family="Arial" font-size="16" fill="white" text-anchor="middle">${name}</text>
  <path d="M80 140 Q100 120 120 140" stroke="white" stroke-width="2" fill="none" />
  <circle cx="70" cy="130" r="10" fill="white" fill-opacity="0.5" />
  <circle cx="130" cy="130" r="10" fill="white" fill-opacity="0.5" />
</svg>
  `;
  
  // Write the SVG file
  fs.writeFileSync(path.join(soundsDir, `${name}.svg`), svgContent);
  console.log(`Created ${name}.svg`);
});

function getRandomColor() {
  const colors = [
    '#4285F4', // Blue
    '#34A853', // Green
    '#FBBC05', // Yellow
    '#EA4335', // Red
    '#673AB7', // Purple
    '#3F51B5', // Indigo
    '#2196F3', // Light Blue
    '#009688', // Teal
    '#FF5722', // Deep Orange
    '#795548', // Brown
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

console.log('All placeholder images created successfully!');
