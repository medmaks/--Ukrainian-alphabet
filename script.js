// Клас для створення літери
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
  // Метод для відтворення звуку
  playSound() {
    const audio = new Audio(this.soundFile);
    audio.volume = VolumeManager.getVolume();
    audio.play();
  }
}
// Клас для керування алфавітом
class Alphabet {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.letters = [];
  }
  
  addLetter(letter) {
    this.letters.push(letter);
  }
  
  render() {
    this.container.innerHTML = ''; // Очищаємо контейнер перед рендерингом
    this.letters.forEach(letter => {
      this.container.appendChild(letter.render()); 
    });
  }
}
// Клас для керування темою
class ThemeManager {
  static initialize() {
   // Перевірка збереженої теми в localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }
    
    // Налаштування обробника події для кнопки теми
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => this.toggleTheme());
  }
  
  static toggleTheme() {
    document.body.classList.toggle('light-theme');
    // Зберігаємо вибір теми в localStorage
    const isLightTheme = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
    
    // Обновляем текст кнопки
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.textContent = isLightTheme ? 'Темна тема' : 'Світла тема';
  }
}
// Клас для керування гучністю
class VolumeManager {
  static volume = 1.0;
  
  static initialize() {
    // Перевірка збереженого рівня гучності в localStorage
    const savedVolume = localStorage.getItem('volume');
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }
    
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    
    // Встановлюємо початкове значення повзунка
    volumeSlider.value = this.volume;
    volumeValue.textContent = `${Math.round(this.volume * 100)}%`;
    
    // Обробник зміни гучності
    volumeSlider.addEventListener('input', (e) => {
      this.volume = parseFloat(e.target.value);
      volumeValue.textContent = `${Math.round(this.volume * 100)}%`;
      localStorage.setItem('volume', this.volume);
    });
  }
  
  static getVolume() {
    return this.volume;
  }
}

class SettingsPanel {
  static initialize() {
    const settingsButton = document.getElementById('settingsButton');
    const settingsPanel = document.getElementById('settingsPanel');
    
    settingsButton.addEventListener('click', () => {
      const isVisible = settingsPanel.style.display === 'block';
      settingsPanel.style.display = isVisible ? 'none' : 'block';
    });
    
    // Закриття панелі при натисканні поза нею
    document.addEventListener('click', (e) => {
      if (!settingsPanel.contains(e.target) && e.target !== settingsButton) {
        settingsPanel.style.display = 'none';
      }
    });
  }
}

// Ініціалізація програми
document.addEventListener('DOMContentLoaded', () => {
  // "АБЕТКА" - створення алфавіту
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
  
  // Ініціалізуємо менеджери
  ThemeManager.initialize();
  VolumeManager.initialize();
  SettingsPanel.initialize();
  
  // Встановлюємо правильний текст кнопки теми
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.textContent = document.body.classList.contains('light-theme') ? 'Темна тема' : 'Світла тема';
  
  // Додаємо функціональність для кнопки "Випадкова літера"
  const randomLetterButton = document.getElementById('randomLetterButton');
  randomLetterButton.addEventListener('click', () => {
    // Вибираємо випадкову літеру з масиву
    const randomIndex = Math.floor(Math.random() * lettersData.length);
    const randomLetter = lettersData[randomIndex];
    
    // Відтворюємо звук цієї літери
    const audio = new Audio(randomLetter.sound);
    audio.volume = VolumeManager.getVolume();
    audio.play();
  });
});