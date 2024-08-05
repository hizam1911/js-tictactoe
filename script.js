let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
let currentPlayer = 'X';
let gameOver = true; // Game starts with gameOver set to true (not started)
let playerXType = 'human'; // Default to human player for X
let playerOType = 'easyAI'; // Default to easy AI for O

const cells = document.querySelectorAll('.cell');
const messageText = document.getElementById('message');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const playerXSelect = document.getElementById('playerX');
const playerOSelect = document.getElementById('playerO');

const playerTypes = {
    'human': 'Human',
    'easyAI': 'Easy AI',
    'hardAI': 'Hard AI'
};

function checkWinner(player) {
    // Check rows
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
            return true;
        }
    }
    // Check columns
    for (let j = 0; j < 3; j++) {
        if (board[0][j] === player && board[1][j] === player && board[2][j] === player) {
            return true;
        }
    }
    // Check diagonals
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
        return true;
    }
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
        return true;
    }
    return false;
}

function isBoardFull() {
    for (let row of board) {
        for (let cell of row) {
            if (cell === '') {
                return false;
            }
        }
    }
    return true;
}

function makeMove(row, col) {
    if (gameOver || board[row][col] !== '') {
        return;
    }

    board[row][col] = currentPlayer;
    cells[row * 3 + col].innerText = currentPlayer;

    if (checkWinner(currentPlayer)) {
        messageText.innerText = `Player ${currentPlayer} wins!`;
        gameOver = true;
        resetButton.disabled = false;
    } else if (isBoardFull()) {
        messageText.innerText = "It's a tie!";
        gameOver = true;
        resetButton.disabled = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if ((currentPlayer === 'X' && playerXType === 'hardAI') ||
            (currentPlayer === 'O' && playerOType === 'hardAI')) {
            makeHardAIMove();
        } else if ((currentPlayer === 'X' && playerXType === 'easyAI') ||
                   (currentPlayer === 'O' && playerOType === 'easyAI')) {
            makeEasyAIMove();
        }
    }
}

function makeEasyAIMove() {
    if (gameOver) {
        return;
    }

    let emptyCells = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                emptyCells.push({ row: i, col: j });
            }
        }
    }

    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    makeMove(randomCell.row, randomCell.col);
}

function makeHardAIMove() {
    if (gameOver) {
        return;
    }

    // Minimax algorithm implementation for hard AI
    let bestMove = minimax(board, currentPlayer);
    makeMove(bestMove.row, bestMove.col);
}

function minimax(board, player) {
    // Base cases: check if the game is over
    if (checkWinner('X')) {
        return { score: -10 };
    } else if (checkWinner('O')) {
        return { score: 10 };
    } else if (isBoardFull()) {
        return { score: 0 };
    }

    // Collect all possible moves and their scores
    let moves = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                let move = {};
                move.row = i;
                move.col = j;
                board[i][j] = player;
                if (player === 'O') {
                    let result = minimax(board, 'X');
                    move.score = result.score;
                } else {
                    let result = minimax(board, 'O');
                    move.score = result.score;
                }
                board[i][j] = '';
                moves.push(move);
            }
        }
    }

    // Evaluate the best move for the current player
    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

function startGame() {
    // Reset game state
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    currentPlayer = 'X';
    gameOver = false;
    messageText.innerText = '';
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.cursor = 'pointer';
    });
    resetButton.disabled = true;

    // Update player types based on user selection
    playerXType = document.getElementById('playerX').value;
    playerOType = document.getElementById('playerO').value;

    // Disable player selection after starting the game
    document.getElementById('playerX').disabled = true;
    document.getElementById('playerO').disabled = true;
    startButton.disabled = true;

    // If AI starts, make the first move
    if ((currentPlayer === 'X' && playerXType !== 'human') ||
        (currentPlayer === 'O' && playerOType !== 'human')) {
        if (currentPlayer === 'X' && playerXType === 'hardAI') {
            makeHardAIMove();
        } else if (currentPlayer === 'X' && playerXType === 'easyAI') {
            makeEasyAIMove();
        } else if (currentPlayer === 'O' && playerOType === 'hardAI') {
            makeHardAIMove();
        } else if (currentPlayer === 'O' && playerOType === 'easyAI') {
            makeEasyAIMove();
        }
    }
}

function resetGame() {
    // Reset game state to initial values
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    currentPlayer = 'X';
    gameOver = true;
    messageText.innerText = '';
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.cursor = 'default';
    });
    document.getElementById('playerX').disabled = false;
    document.getElementById('playerO').disabled = false;
    startButton.disabled = false;
    resetButton.disabled = true;
}
