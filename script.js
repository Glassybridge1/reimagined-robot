// Hangman words list
const hangmanWords = [
    'JAVASCRIPT', 'PYTHON', 'HTML', 'CSS', 'REACT', 'NODEJS', 'FLASK', 'Django', 'Express', 'Angular', 'Vue', 'React', 'Nodejs', 'Ruby', 'Swift', 'Kotlin', 'Go', 'PHP', 'SQL', 'JavaScript', 'HTML', 'CSS'
];

// Tic Tac Toe
let ticTacToeBoard, currentPlayer, ticTacToeContainer;

function renderTicTacToe() {
    ticTacToeBoard = [['', '', ''], ['', '', ''], ['', '', '']];
    currentPlayer = 'X';
    ticTacToeContainer = document.getElementById('tic-tac-toe');
    ticTacToeContainer.innerHTML = ''; 
    ticTacToeContainer.style.display = 'block'; 
    for (let i = 0; i < 3; i++) {
        const row = document.createElement('div');
        row.className = 'tic-tac-toe-row';
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('button');
            cell.className = 'tic-tac-toe-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', ticTacToeClick);
            row.appendChild(cell);
        }
        ticTacToeContainer.appendChild(row);
    }
    document.getElementById('reset-btn').style.display = 'block';
}

function ticTacToeClick(event) {
    const cell = event.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    if (ticTacToeBoard[row][col] === '') {
        ticTacToeBoard[row][col] = currentPlayer;
        cell.textContent = currentPlayer;
        if (checkWinner()) {
            alert(`Player ${currentPlayer} wins!`);
            resetAndHideAllGames();
        } else if (ticTacToeBoard.flat().every(cell => cell !== '')) {
            alert("It's a draw!");
            resetAndHideAllGames();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function checkWinner() {
    for (let i = 0; i < 3; i++) {
        if (ticTacToeBoard[i][0] === ticTacToeBoard[i][1] && ticTacToeBoard[i][1] === ticTacToeBoard[i][2] && ticTacToeBoard[i][0] !== '') return true;
        if (ticTacToeBoard[0][i] === ticTacToeBoard[1][i] && ticTacToeBoard[1][i] === ticTacToeBoard[2][i] && ticTacToeBoard[0][i] !== '') return true;
    }
    if (ticTacToeBoard[0][0] === ticTacToeBoard[1][1] && ticTacToeBoard[1][1] === ticTacToeBoard[2][2] && ticTacToeBoard[0][0] !== '') return true;
    if (ticTacToeBoard[0][2] === ticTacToeBoard[1][1] && ticTacToeBoard[1][1] === ticTacToeBoard[2][0] && ticTacToeBoard[0][2] !== '') return true;
    return false;
}

// Hangman
let hangmanWord, hangmanGuesses, hangmanMaxTries, hangmanCurrentTries;

function renderHangman() {
    hangmanWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
    hangmanGuesses = [];
    hangmanMaxTries = 6;
    hangmanCurrentTries = 0;

    const hangmanContainer = document.getElementById('hangman');
    hangmanContainer.innerHTML = ''; 
    hangmanContainer.style.display = 'block'; 

    const wordContainer = document.createElement('h2');
    wordContainer.id = 'hangman-word';
    wordContainer.textContent = renderHangmanWord();
    hangmanContainer.appendChild(wordContainer);

    const input = document.createElement('input');
    input.id = 'hangman-input';
    input.maxLength = 1; 
    hangmanContainer.appendChild(input);

    const button = document.createElement('button');
    button.textContent = 'Guess';
    button.addEventListener('click', () => {
        hangmanGuess(input.value.toUpperCase());
        input.value = ''; 
    });
    hangmanContainer.appendChild(button);

    const triesContainer = document.createElement('p');
    triesContainer.id = 'hangman-tries';
    triesContainer.textContent = `Tries left: ${hangmanMaxTries}`;
    hangmanContainer.appendChild(triesContainer);

    document.getElementById('reset-btn').style.display = 'block';
}

function renderHangmanWord() {
    return hangmanWord.split('').map(letter => hangmanGuesses.includes(letter) ? letter : '_').join(' ');
}

function hangmanGuess(guess) {
    if (!hangmanGuesses.includes(guess) && hangmanWord.includes(guess)) {
        hangmanGuesses.push(guess);
    } else {
        hangmanCurrentTries++;
    }

    document.getElementById('hangman-word').textContent = renderHangmanWord();
    document.getElementById('hangman-tries').textContent = `Tries left: ${hangmanMaxTries - hangmanCurrentTries}`;

    if (hangmanCurrentTries >= hangmanMaxTries) {
        alert('Game over! The word was: ' + hangmanWord);
        resetAndHideAllGames();
    }
}

// Memory Game
let memoryMatchCards, memoryMatchFlippedCards;

function renderMemoryMatch() {
    memoryMatchCards = shuffleArray(generateMemoryMatchCards());
    memoryMatchFlippedCards = [];
    
    const memoryMatchContainer = document.getElementById('memory-match');
    memoryMatchContainer.innerHTML = ''; 
    memoryMatchContainer.style.display = 'block'; 
    memoryMatchCards.forEach(card => {
        const cardElement = document.createElement('button');
        cardElement.className = 'memory-card';
        cardElement.dataset.value = card.value;
        cardElement.addEventListener('click', memoryMatchClick);
        memoryMatchContainer.appendChild(cardElement);
    });

    document.getElementById('reset-btn').style.display = 'block';
}

function generateMemoryMatchCards() {
    const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let cards = values.concat(values).map(value => ({ value: value, flipped: false }));
    return cards;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function memoryMatchClick(event) {
    const card = event.target;
    const value = card.dataset.value;
    
    if (!card.textContent && memoryMatchFlippedCards.length < 2) {
        card.textContent = value;
        memoryMatchFlippedCards.push(card);

        if (memoryMatchFlippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [card1, card2] = memoryMatchFlippedCards;
    
    if (card1.dataset.value !== card2.dataset.value) {
        card1.textContent = '';
        card2.textContent = '';
    }
    
    memoryMatchFlippedCards = [];
}

// Trivia Quiz
const quizQuestions = [
    { question: 'What is the capital of Australia?', options: ['Sydney', 'Canberra', 'Melbourne'], answer: 'Canberra' },
    { question: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze'], answer: 'Nile' },
    { question: 'Who discovered penicillin?', options: ['Marie Curie', 'Alexander Fleming', 'Louis Pasteur'], answer: 'Alexander Fleming' },
    { question: 'Which planet is known for its rings?', options: ['Jupiter', 'Saturn', 'Uranus'], answer: 'Saturn' },
    { question: 'What is the capital city of Japan?', options: ['Seoul', 'Tokyo', 'Beijing'], answer: 'Tokyo' },
    { question: 'Which element has the atomic number 1?', options: ['Oxygen', 'Hydrogen', 'Helium'], answer: 'Hydrogen' },
    { question: 'What is the hardest mineral on the Mohs scale?', options: ['Corundum', 'Diamond', 'Topaz'], answer: 'Diamond' },
    { question: 'Which gas is most abundant in the Earth’s atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen'], answer: 'Nitrogen' },
    { question: 'What is the main language spoken in Brazil?', options: ['Spanish', 'Portuguese', 'French'], answer: 'Portuguese' },
    { question: 'Which planet is closest to the Sun?', options: ['Earth', 'Mars', 'Mercury'], answer: 'Mercury' },
    { question: 'Who wrote "The Great Gatsby"?', options: ['F. Scott Fitzgerald', 'Ernest Hemingway', 'William Faulkner'], answer: 'F. Scott Fitzgerald' },
    { question: 'What is the boiling point of water in Celsius?', options: ['90°C', '100°C', '120°C'], answer: '100°C' },
    { question: 'What is the largest desert in the world?', options: ['Sahara', 'Arabian', 'Antarctic'], answer: 'Antarctic' },
    { question: 'Which country is known as the Land of the Rising Sun?', options: ['China', 'Japan', 'South Korea'], answer: 'Japan' },
    { question: 'What is the smallest country in the world?', options: ['Monaco', 'Nauru', 'Vatican City'], answer: 'Vatican City' },
    { question: 'What is the most widely spoken language in the world?', options: ['English', 'Mandarin', 'Spanish'], answer: 'Mandarin' },
    { question: 'Which planet is known as the Earth’s twin?', options: ['Venus', 'Mars', 'Jupiter'], answer: 'Venus' },
    { question: 'Who is known as the father of modern physics?', options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei'], answer: 'Albert Einstein' },
    { question: 'In what year did the Berlin Wall fall?', options: ['1989', '1991', '1985'], answer: '1989' },
    { question: 'What is the largest ocean on Earth?', options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean'], answer: 'Pacific Ocean' }
];
let currentQuestionIndex = 0;

function renderTriviaQuiz() {
    const quizContainer = document.getElementById('trivia-quiz');
    quizContainer.innerHTML = ''; 
    quizContainer.style.display = 'block'; 

    const questionElement = document.createElement('h2');
    questionElement.textContent = quizQuestions[currentQuestionIndex].question;
    quizContainer.appendChild(questionElement);

    const optionsContainer = document.createElement('div');
    quizQuestions[currentQuestionIndex].options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = option;
        button.addEventListener('click', () => quizClick(option));
        optionsContainer.appendChild(button);
    });

    quizContainer.appendChild(optionsContainer);
    document.getElementById('reset-btn').style.display = 'block';
}

function quizClick(selectedAnswer) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.answer) {
        alert('Correct!');
    } else {
        alert('Incorrect! The correct answer was: ' + currentQuestion.answer);
    }

    currentQuestionIndex++;
    if (currentQuestionIndex >= quizQuestions.length) {
        alert("Quiz over!");
        currentQuestionIndex = 0; // Reset to the first question
    }
    renderTriviaQuiz();
}

// Reset and Hide All Games
function resetAndHideAllGames() {
    document.querySelectorAll('.game-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('reset-btn').style.display = 'none';
}

// Initialize game view
document.addEventListener('DOMContentLoaded', () => {
    const ticTacToeButton = document.getElementById('tic-tac-toe-btn');
    ticTacToeButton.addEventListener('click', renderTicTacToe);

    const hangmanButton = document.getElementById('hangman-btn');
    hangmanButton.addEventListener('click', renderHangman);

    const memoryMatchButton = document.getElementById('memory-match-btn');
    memoryMatchButton.addEventListener('click', renderMemoryMatch);

    const triviaQuizButton = document.getElementById('trivia-quiz-btn');
    triviaQuizButton.addEventListener('click', renderTriviaQuiz);

    const resetButton = document.getElementById('reset-btn');
    resetButton.addEventListener('click', resetAndHideAllGames);
});