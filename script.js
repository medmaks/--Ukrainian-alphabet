class Letter {
  constructor(symbol, soundFile) {
    this.symbol = symbol;
    this.soundFile = soundFile;
  }

  render() {
    const div = document.createElement('div');
    div.className = 'letter';
    div.textContent = this.symbol;

    div.addEventListener('click', () => this.playSound());
    return div;
  }

  playSound() {
    const audio = new Audio(this.soundFile);
    audio.play();
  }
}

class Alphabet {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.letters = [];
  }

  addLetter(letter) {
    this.letters.push(letter);
  }

  render() {
    this.letters.forEach(letter => {
      this.container.appendChild(letter.render());
    });
  }
}

const alphabet = new Alphabet('alphabet');

const lettersData = [
  { symbol: 'А', sound: 'sound/а.mp3' },
  { symbol: 'Б', sound: 'sound/б.mp3' },
  { symbol: 'В', sound: 'sound/в.mp3' },
  { symbol: 'Г', sound: 'sound/г.mp3' },
  { symbol: 'Ґ', sound: 'sound/ґ.mp3' },
  { symbol: 'Д', sound: 'sound/д.mp3' },
  { symbol: 'Е', sound: 'sound/е.mp3' },
  { symbol: 'Є', sound: 'sound/є.mp3' },
  { symbol: 'Ж', sound: 'sound/ж.mp3' },
  { symbol: 'З', sound: 'sound/з.mp3' },
  { symbol: 'И', sound: 'sound/и.mp3' },
  { symbol: 'І', sound: 'sound/і.mp3' },
  { symbol: 'Ї', sound: 'sound/ї.mp3' },
  { symbol: 'Й', sound: 'sound/й.mp3' },
  { symbol: 'К', sound: 'sound/к.mp3' },
  { symbol: 'Л', sound: 'sound/л.mp3' },
  { symbol: 'М', sound: 'sound/м.mp3' },
  { symbol: 'Н', sound: 'sound/н.mp3' },
  { symbol: 'О', sound: 'sound/о.mp3' },
  { symbol: 'П', sound: 'sound/п.mp3' },
  { symbol: 'Р', sound: 'sound/р.mp3' },
  { symbol: 'С', sound: 'sound/с.mp3' },
  { symbol: 'Т', sound: 'sound/т.mp3' },
  { symbol: 'У', sound: 'sound/у.mp3' },
  { symbol: 'Ф', sound: 'sound/ф.mp3' },
  { symbol: 'Х', sound: 'sound/х.mp3' },
  { symbol: 'Ц', sound: 'sound/ц.mp3' },
  { symbol: 'Ч', sound: 'sound/ч.mp3' },
  { symbol: 'Ш', sound: 'sound/ш.mp3' },
  { symbol: 'Щ', sound: 'sound/щ.mp3' },
  { symbol: 'Ь', sound: 'sound/ь.mp3' },
  { symbol: 'Ю', sound: 'sound/ю.mp3' },
  { symbol: 'Я', sound: 'sound/я.mp3' }
];
lettersData.forEach(data => {
  const letter = new Letter(data.symbol, data.sound);
  alphabet.addLetter(letter);
});

alphabet.render();
