import ancientsData from "./data/ancients.js";
import greenCardsData from "./data/mythicCards/green/index.js";
import brownCardsData from "./data/mythicCards/brown/index.js";
import blueCardsData from "./data/mythicCards/blue/index.js";

const root = document.getElementById("root");

function getRootTemplate() {
  return `<div class="ancients-container"> ${getAncientsContainer()}</div>
    <div class="difficulty-container hidden" id="difficultyContainer">${getButtons()} </div>
    <div class="deck-container"></div>`;
}

function getAncientsContainer() {
  const data = ancientsData.reduce((acc, elem, index) => {
    return `${acc} <input type='button' class="ancient-card" id=${elem.id} style="background-image: url(${elem.cardFace});"/ >
        `;
  }, "");
  return data;
}

function initApp() {
  root.innerHTML = getRootTemplate();
}

initApp();

function getButtons() {
  return `<button type="text" class="difficulty" id="easy">Easy </button>
      <button type="text" class="difficulty" id="normal">Middle</button>
      <button type="text" class="difficulty" id="hard">Difficult</button>`;
}

function getButtonDeck() {
  return `<button type="text" class="shuffle-button ">Shuffle the deck </button> `;
}
function getDeck() {
  return `<div class="current-state ">${currentStateElem()}</div>
    <div class="deck "></div>
    <div class="last-card "></div>
    `;
}
const stageMaper = {
  0: "First stage",
  1: "Second stage",
  2: "Third stage",
};
function currentStateElem() {
  return template.reduce(function (acc, elem, index) {
    return (
      acc +
      `<div class="stage-container">
    <span class="stage-text">${stageMaper[index]}</span>
    <div class="dots-container">
    <div class="dot green">${elem.greenCards}</div>
    <div class="dot brown">${elem.brownCards}</div>
    <div class="dot blue">${elem.blueCards}</div>
    </div>
  
    </div>`
    );
  }, "");
}

const ancientsContainer = document.querySelector(".ancients-container");
const difficultyContainer = document.querySelector(".difficulty-container");

let template;
let difficulty;
let matrix = [];
let currentRow = 0;
let ancient = "";
let carenTemplate;

const deckContainer = document.querySelector(".deck-container");
const difficultyBtns = document.querySelectorAll(".difficulty");

function addSelectorCardStyle(id) {
  const ancientCards = document.querySelectorAll(".ancient-card");
  ancientCards.forEach(function (elem) {
    if (elem.id == id) {
      elem.classList.add("border");
    } else {
      elem.classList.remove("border");
    }
  });
}
function showDifficultyBtns(event) {
  if (ancient == event.target.id) {
    return;
  }
  if (ancient) {
    deckContainer.innerHTML = getButtonDeck();
    const shuffleButton = document.querySelector(".shuffle-button");
    shuffleButton.onclick = shuffleCards;
  }
  ancient = event.target.id;
  addSelectorCardStyle(event.target.id);
  if (event.target.matches(".ancient-card")) {
    difficultyContainer.classList.remove("hidden");
    const selectedAncientsData = ancientsData.find(
      (elem) => elem.id == event.target.id
    );

    template = [
      selectedAncientsData.firstStage,
      selectedAncientsData.secondStage,
      selectedAncientsData.thirdStage,
    ];
    carenTemplate = JSON.parse(JSON.stringify(template));
  }
}

function shuffleCards() {
  generateMatrix();
  deckContainer.innerHTML = `<div class="deck-containersArray">${getDeck()}</div>`;
  const deckCart = document.querySelector(".deck");
  deckCart.addEventListener("click", handleClickOnDeckCard);
}

function chooseDifficulty(event) {
  deckContainer.innerHTML = getButtonDeck();
  const shuffleButton = document.querySelector(".shuffle-button");
  shuffleButton.onclick = shuffleCards;
  difficulty = event.target.id;
  addSelectorButton();
  template = JSON.parse(JSON.stringify(carenTemplate));
}
difficultyBtns.forEach(function (button) {
  button.addEventListener("click", chooseDifficulty);
});

function addSelectorButton() {
  difficultyBtns.forEach(function (button) {
    if (difficulty == button.id) {
      button.classList.add("color");
    } else {
      button.classList.remove("color");
    }
  });
}
ancientsContainer.addEventListener("click", showDifficultyBtns);

function getEasyCards(cardsData) {
  return cardsData.filter(
    (elem) => elem.difficulty == "easy" || elem.difficulty == "normal"
  );
}

function getNormalCards(cardsData) {
  return cardsData;
}

function getHardCards(cardsData) {
  return cardsData.filter(
    (elem) => elem.difficulty == "hard" || elem.difficulty == "normal"
  );
}

const shuffledArray = (array) => array.sort((a, b) => 0.5 - Math.random());

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const difficultyMapper = {
  easy: getEasyCards,
  normal: getNormalCards,
  hard: getHardCards,
};
function arrayGreitCards(cardsNumber, filterCards, row) {
  new Array(cardsNumber).fill(0).forEach(() => {
    const number = getRandomArbitrary(0, filterCards.length);

    const card = filterCards.splice(number, 1)[0];
    row.push(card);
  });
}

function generateMatrix() {
  matrix = [];
  currentRow = 0;
  const filtergreenCards = difficultyMapper[difficulty](greenCardsData);
  const filterbrownCards = difficultyMapper[difficulty](brownCardsData);
  const filterblueCards = difficultyMapper[difficulty](blueCardsData);

  template.forEach((templ) => {
    const greenCardsNumber = templ.greenCards;
    const brownCardsNumber = templ.brownCards;
    const blueCardsNumber = templ.blueCards;

    const row = [];

    arrayGreitCards(greenCardsNumber, filtergreenCards, row);
    arrayGreitCards(brownCardsNumber, filterbrownCards, row);
    arrayGreitCards(blueCardsNumber, filterblueCards, row);

    matrix.push(row);
  });

  console.log(template);
}

function handleClickOnDeckCard() {
  if (!matrix[currentRow].length) {
    currentRow++;
  }
  if (currentRow == 3) {
    document.querySelector(".deck").style.visibility = "hidden";
    return;
  }

  const currentArray = matrix[currentRow];
  shuffledArray(currentArray);
  const card = currentArray.splice(0, 1)[0];
  showCard(card);

  const obj = template[currentRow];
  obj[`${card.color}Cards`] = obj[`${card.color}Cards`] - 1;
  updateMatrix();

  console.log(template);
}

function showCard(card) {
  const lastCard = document.querySelector(".last-card");

  lastCard.style.backgroundImage = `url(${card.cardFace})`;
}

function updateMatrix() {
  const currentState = document.querySelector(".current-state");
  currentState.innerHTML = currentStateElem();
}
