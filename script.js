const questions = {
    easy: {
        fruits: { 'apple': 'A round red fruit.', 'banana': 'A long yellow fruit.' },
        animals: { 'lion': 'The most fierce animal of the jungle.', 'giraffe': 'Tallest land animal.' },
        colors: { 'red': 'The color of fire.', 'purple': 'What color do you get by mixing red and blue?','yellow': 'What color is a ripe banana?' }
    },
    medium: {
        countries: { 'india': 'A country in South Asia.', 'brazil': 'The largest country in South America.' },
        currencies: { 'rupee': 'Currency of India.', 'dollar': 'Currency of the USA.' },
        'political parties': { 'bjp': 'Current ruling party in India.','indian national congress': 'Which political party was led by Jawaharlal Nehru and played a major role in Indian independence movement?','all india trinamool congress': 'Which political party is based mainly in the state of West Bengal and led by Mamata Banerjee?' }
    },
    hard: {
        oceans: { 'pacific': 'The largest ocean on Earth.', 'atlantic': 'Second largest ocean.', 'indian ocean': 'Which ocean is located between Africa, Asia, Australia, and the Southern Ocean?', 'arctic ocean': 'Which ocean is known for being the coldest?', 'southern ocean': 'Which ocean surrounds Antarctica?', 'Gulf Stream': 'Which ocean current is the strongest and helps regulate climate?' },
        instruments: { 'guitar': 'A string instrument.', 'drums': 'Percussion instrument.','trumpet': 'Which instrument is part of the brass family and has three valves?' , 'xylophone': 'What percussion instrument is played by striking it with mallets and has a series of metal plates?'},
        'engineering roles' : { 'software engineer': 'Develops software systems.','electrical engineer': 'What type of engineer works on designing and improving electrical systems, such as power grids and electronics?','aerospace engineer': 'Which engineer is responsible for designing aircraft, spacecraft, and satellites?' }
    }
};

let chosenWord = '';
let chosenQuestion = '';
let displayedWord = '';
let attemptsLeft = 6;
let hintsLeft = 2;
let timer;
let timeLeft = 30;
let musicEnabled = false;

const wordElement = document.getElementById('word');
const questionElement = document.getElementById('question');
const letterButtonsContainer = document.getElementById('letter-buttons');
const attemptsElement = document.getElementById('attempts');
const timerElement = document.getElementById('timer');
const soundIcon = document.getElementById('sound-icon');
const backgroundMusic = document.getElementById('background-music');
const hintButton = document.getElementById('hint-btn');

// Select Difficulty
function selectDifficulty(level) {
    document.getElementById('difficulty-selection').classList.add('hidden');
    document.getElementById('domain-selection').classList.remove('hidden');
}

// Select Domain
function selectDomain(level, domain) {
    const words = questions[level][domain];
    const wordKeys = Object.keys(words);
    chosenWord = wordKeys[Math.floor(Math.random() * wordKeys.length)];
    chosenQuestion = words[chosenWord];
    startNewGame();
    document.getElementById('domain-selection').classList.add('hidden');
    document.getElementById('game-ui').classList.remove('hidden');
}

// Start a new game
function startNewGame() {
    displayedWord = '_'.repeat(chosenWord.length);
    attemptsLeft = 6;
    hintsLeft = 2;
    timeLeft = 30;
    questionElement.textContent = chosenQuestion;
    updateWordDisplay();
    createLetterButtons();
    updateAttemptsDisplay();
    resetTimer();
    hintButton.disabled = false;
}

// Update displayed word
function updateWordDisplay() {
    wordElement.textContent = displayedWord.split('').join(' ');
}

// Create letter buttons
function createLetterButtons() {
    letterButtonsContainer.innerHTML = '';
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    letters.forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.addEventListener('click', () => handleGuess(letter, button));
        letterButtonsContainer.appendChild(button);
    });
}

// Handle guessed letter
function handleGuess(letter, button) {
    button.disabled = true;
    if (chosenWord.includes(letter)) {
        for (let i = 0; i < chosenWord.length; i++) {
            if (chosenWord[i] === letter) {
                displayedWord = displayedWord.substring(0, i) + letter + displayedWord.substring(i + 1);
            }
        }
        updateWordDisplay();
        checkWin();
    } else {
        attemptsLeft--;
        updateAttemptsDisplay();
        if (attemptsLeft === 0) {
            endGame(false);
        }
    }
}

// Give a hint
function giveHint() {
    if (hintsLeft > 0) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * chosenWord.length);
        } while (displayedWord[randomIndex] !== '_');
        
        const hintLetter = chosenWord[randomIndex];
        displayedWord = displayedWord.substring(0, randomIndex) + hintLetter + displayedWord.substring(randomIndex + 1);
        updateWordDisplay();
        hintsLeft--;
        if (hintsLeft === 0) {
            hintButton.disabled = true;
        }
        checkWin();
    }
}

// Update attempts left
function updateAttemptsDisplay() {
    attemptsElement.textContent = attemptsLeft;
}

// Check for a win
function checkWin() {
    if (displayedWord === chosenWord) {
        endGame(true);
    }
}

// End the game
function endGame(isWin) {
    clearInterval(timer);
    if (isWin) {
        alert('Congratulations! You guessed the word.');
    } else {
        alert(`Game Over! The correct word was: ${chosenWord}`);
    }
    resetGame();
}

// Reset game to start a new one
function resetGame() {
    document.getElementById('game-ui').classList.add('hidden');
    document.getElementById('domain-selection').classList.remove('hidden');
}

// Timer function
function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time left: ${timeLeft}`;
        if (timeLeft === 0) {
            endGame(false);
        }
    }, 1000);
}

// Toggle sound
function toggleSound() {
    musicEnabled = !musicEnabled;
    if (musicEnabled) {
        backgroundMusic.play();
        soundIcon.textContent = '🔊';
    } else {
        backgroundMusic.pause();
        soundIcon.textContent = '🔈';
    }
}
