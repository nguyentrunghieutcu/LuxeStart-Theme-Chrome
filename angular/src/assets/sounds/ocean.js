// This script creates a valid audio file using the Web Audio API
// Run this in the browser to generate the audio files

function generateTone(frequency, duration, volume) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, duration);
  
  // Export to a file (this would need to be done in a real environment)
  // For this example, we'll just play the sound
}

// Generate different tones for different soundscapes
// Ocean: low frequency, long duration
generateTone(100, 3000, 0.3);

// Rainfall: medium frequency, medium duration
// generateTone(300, 2000, 0.2);

// Thunderstorm: low and high frequencies alternating
// generateTone(80, 1000, 0.4);
// setTimeout(() => generateTone(400, 500, 0.5), 1200);

// Atmospheric: medium-high frequency, long duration
// generateTone(250, 4000, 0.2);
