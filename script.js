// ИНИЦИАЛИЗАЦИЯ
const cards = document.querySelectorAll('.game__card');
const body = document.body;
const CARD_COUNTER = 6;
const WAIT_TIME = 5000; //ms

// Константы для отслеживания состояния карт и игрового поля
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchCounter = 0;
const winScreen = document.querySelector('.win');

// Переворот карты
function flipCard() {
  // Запрещает поворот если  поле закрыто.
  if (lockBoard) return;
  // Не переворачивает карту, если она уже выбрана
  if (this === firstCard) return;

  // Перевернуть карту (смена стиля игровой карточки)
  this.classList.add('flip');

  // Если выбранная карта - первая, она запоминается для сравнения
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  // Если выбранная карта - вторая, она запоминается для сравнения
  secondCard = this;
  // Закрываем поле от дальнейших кликов
  lockBoard = true;
  // Проверяем карты на совпадение
  checkForMatch();
}

// Проверка карт на совпадение через HTML параметр dataset.name.
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  // Совпало? отключаем переворот. Иначе - переворачиваем карты обратно
  isMatch ? matchFound() : mistakeFound();
}

// Пользователь нашел совпадение
function matchFound() {
  // подсветка поля
  body.classList.add('match');
  // убираем возможность взаимодействия с картами
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  // очищаем переменные запомненных карт
  resetBoard();
  // 
  setTimeout(() => {
    body.classList.remove('match');
  }, 1000);
  // Корректируем счетчик открытых пар
  matchCounter += 1;
  // Если открыты все карты - показываем окно победы
  if (matchCounter === CARD_COUNTER) {
    winScreen.classList.remove('hidden');
  }
}

// Переворот карт через полторы секунды в случае ошибки пользователя
function mistakeFound() {
  body.classList.add('mistake');
  
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    body.classList.remove('mistake');
    resetBoard();
  }, 1500);
}

// Сброс запомненных параметров поля
// (первая, вторая карта, состояние перевернутых карт, закрытие поля)
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Перемешать карты
const shuffleField = function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 10);
    card.style.order = randomPos;
  });
}

// Пользователь видит карты, затем они переворачиваются рубашкой вверх.
const startGame = function () {
  cards.forEach(card => card.classList.add('flip'));
setTimeout( () => {
  cards.forEach(card => card.classList.remove('flip'));
  // Перебор массива карт и навешивание листенера на событие клика мыши.
  cards.forEach(card => card.addEventListener('click', flipCard));
}, 4000)
}

// Кнопка сброса
const resetFunc = function () {
  cards.forEach(card => card.classList.remove('flip'));
  setTimeout(() => {
    resetBoard();
    shuffleField();
    startGame();
    matchCounter = 0;
  }, 1000);
}

// Кнопка играть снова
const playAgain = function () {
  winScreen.classList.add('hidden');
  resetFunc();
}

// Слушатели на кнопки сброса и рестарта
const resetButton = document.querySelector('.buttons__reset');
resetButton.addEventListener('click', resetFunc);

const restartButton = document.querySelector('.win__restart');
restartButton.addEventListener('click', playAgain);

// ИГРА
// Перемешать карты
shuffleField();

// Старт игры
startGame();
