// Singleton для глобальних налаштувань
class AppConfig {
  static instance = null;
  
  constructor() {
    if (AppConfig.instance) return AppConfig.instance;
    this.volume = 1.0;
    this.theme = localStorage.getItem('theme') || 'dark'; // Загружаем тему из localStorage при создании
    AppConfig.instance = this;
  }
}

// Абстрактний клас для поліморфізму
class AudioElement {
  constructor(soundFile) {
    this.soundFile = soundFile;
    this.config = AppConfig.instance || new AppConfig();
  }
  
  playSound() {
    throw new Error("Метод має бути перевизначений");
  }
}

// Клас літери з інкапсуляцією
class Letter extends AudioElement {
  #symbol; // Приватне поле
  
  constructor(symbol, soundFile) {
    super(soundFile);
    this.#symbol = symbol;
    this.next = null; // Для зв'язного списку
  }
  
  get symbol() { return this.#symbol; } // Геттер
  
  playSound() {
    try {
      const audio = new Audio(this.soundFile);
      audio.volume = this.config.volume;
      audio.play();
    } catch (error) {
      throw new AudioError(`Помилка відтворення: ${this.#symbol}`);
    }
  }
  
  render() {
    const div = document.createElement('div');
    div.className = 'letter';
    div.textContent = this.#symbol;
    div.addEventListener('click', () => this.playSound());
    return div;
  }
}

// Кастомні винятки
class AudioError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AudioError';
  }
}

// Однозв'язний список
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  append(letter) {
    if (!this.head) {
      this.head = letter;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = letter;
    }
    this.size++;
  }
  
  // Рекурсивний пошук
  find(symbol, current = this.head) {
    if (!current) return null;
    if (current.symbol === symbol) return current;
    return this.find(symbol, current.next);
  }
  
  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current);
      current = current.next;
    }
    return result;
  }
}

// Observer патерн
class Observable {
  constructor() {
    this.observers = [];
  }
  
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  notify(data) {
    this.observers.forEach(obs => obs.update && obs.update(data));
  }
}

// Strategy патерн для тем
class ThemeStrategy {
  apply() { throw new Error("Має бути реалізовано"); }
}

class DarkTheme extends ThemeStrategy {
  apply() {
    document.body.classList.remove('light-theme');
  }
}

class LightTheme extends ThemeStrategy {
  apply() {
    document.body.classList.add('light-theme');
  }
}

// Управління алфавітом
class Alphabet extends Observable {
  constructor(containerId) {
    super();
    this.container = document.getElementById(containerId);
    this.letters = new LinkedList(); // Динамічна структура
    // Двовимірний масив для категорій
    this.categories = [[], [], []]; // голосні, приголосні, інші
  }
  
  addLetter(letter) {
    this.letters.append(letter);
    this.categorize(letter);
    this.notify({type: 'added', letter});
  }
  
  categorize(letter) {
    const vowels = ['А', 'Е', 'Є', 'И', 'І', 'Ї', 'О', 'У', 'Ю', 'Я'];
    const index = vowels.includes(letter.symbol) ? 0 : 
                 letter.symbol === 'Ь' ? 2 : 1;
    this.categories[index].push(letter);
  }
  
  render() {
    this.container.innerHTML = '';
    const letters = this.letters.toArray();
    letters.forEach(letter => {
      this.container.appendChild(letter.render());
    });
  }
  
  getRandomLetter() {
    const letters = this.letters.toArray();
    return letters[Math.floor(Math.random() * letters.length)];
  }
}

// Command патерн
class PlayRandomCommand {
  constructor(alphabet) {
    this.alphabet = alphabet;
  }
  
  execute() {
    const letter = this.alphabet.getRandomLetter();
    if (letter) letter.playSound();
  }
}

// Factory патерн
class LetterFactory {
  static create(data) {
    return new Letter(data.symbol, data.sound);
  }
}

// Менеджер тем
class ThemeManager {
  constructor() {
    this.config = new AppConfig();
    this.themes = {
      dark: new DarkTheme(),
      light: new LightTheme()
    };
  }
  
  // Підтвердження теми
  applyCurrentTheme() {
    this.themes[this.config.theme].apply();
  }
  
  toggle() {
    const newTheme = this.config.theme === 'dark' ? 'light' : 'dark';
    this.themes[newTheme].apply();
    this.config.theme = newTheme;
    localStorage.setItem('theme', newTheme);
  }
}

// Управління панеллю налаштувань
class SettingsPanel {
  static initialize() {
    const settingsButton = document.getElementById('settingsButton');
    const settingsPanel = document.getElementById('settingsPanel');
    
    if (!settingsButton || !settingsPanel) return;
    
    let isVisible = false;
    
    settingsButton.addEventListener('click', () => {
      isVisible = !isVisible;
      settingsPanel.style.display = isVisible ? 'block' : 'none';
    });
     
    document.addEventListener('click', (e) => {
      if (!settingsPanel.contains(e.target) && e.target !== settingsButton) {
        isVisible = false;
        settingsPanel.style.display = 'none';
      }
    });
  }
}

// Управління гучністю
class VolumeManager {
  static initialize() {
    const savedVolume = localStorage.getItem('volume');
    const config = new AppConfig();
    
    if (savedVolume) config.volume = parseFloat(savedVolume);
    
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    
    if (volumeSlider && volumeValue) {
      volumeSlider.value = config.volume;
      volumeValue.textContent = `${Math.round(config.volume * 100)}%`;
      
      volumeSlider.addEventListener('input', (e) => {
        config.volume = parseFloat(e.target.value);
        volumeValue.textContent = `${Math.round(config.volume * 100)}%`;
        localStorage.setItem('volume', config.volume);
      });
    }
  }
}

// Головний клас (Facade)
class AlphabetApp {
  constructor() {
    this.alphabet = new Alphabet('alphabet');
    this.themeManager = new ThemeManager();
    this.commands = new Map(); // Динамічна структура
  }
  
  initialize() {
    // Одновимірний масив з даними
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
    
    // Створення літер через Factory
    lettersData.forEach(data => {
      const letter = LetterFactory.create(data);
      this.alphabet.addLetter(letter);
    });
    
    this.alphabet.render();
    
    // Команди
    this.commands.set('random', new PlayRandomCommand(this.alphabet));
    
    // Применяем сохраненную тему
    this.themeManager.applyCurrentTheme();
    
    // Ініціалізація менеджерів
    SettingsPanel.initialize();
    VolumeManager.initialize();
    
    // Події
    document.getElementById('randomLetterButton')?.addEventListener('click', 
      () => this.commands.get('random').execute());
    
    document.getElementById('themeToggle')?.addEventListener('click', 
      () => this.themeManager.toggle());
  }
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
  new AlphabetApp().initialize();
});