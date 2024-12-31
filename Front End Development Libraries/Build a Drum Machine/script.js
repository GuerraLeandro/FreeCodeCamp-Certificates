const sounds = {
  Q: 'Heater 1',
  W: 'Heater 2',
  E: 'Heater 3',
  A: 'Heater 4',
  S: 'Clap',
  D: 'Open-HH',
  Z: 'Kick-n-Hat',
  X: 'Kick',
  C: 'Closed-HH'
};

const display = document.getElementById('display');

function playSound(key) {
  const audio = document.querySelector(`#${key} audio`); 
  if (audio) {
    audio.play();
    display.textContent = sounds[key];
  }
}

const drumPads = document.querySelectorAll('.drum-pad');
drumPads.forEach(pad => {
  pad.addEventListener('click', () => playSound(pad.id));
});

document.addEventListener('keydown', (event) => {
  if (sounds[event.key.toUpperCase()]) {
    playSound(event.key.toUpperCase());
  }
});
