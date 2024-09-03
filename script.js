const board = document.querySelector("#board");
const cells = document.querySelectorAll(".cell");
const resetButton = document.querySelector("#reset");
const message = document.querySelector("#message");

let gameBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
let currentPlayer = "X"; // Human player

function printBoard() {
  cells.forEach((cell, index) => {
    cell.textContent = gameBoard[index];
  });
}

function checkWinner(player) {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winConditions.some((condition) =>
    condition.every((index) => gameBoard[index] === player)
  );
}

function isDraw() {
  return gameBoard.every((cell) => cell !== " ");
}

function minimax(isMaximizing) {
  if (checkWinner("O")) return 1;
  if (checkWinner("X")) return -1;
  if (isDraw()) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === " ") {
        gameBoard[i] = "O";
        let score = minimax(false);
        gameBoard[i] = " ";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === " ") {
        gameBoard[i] = "X";
        let score = minimax(true);
        gameBoard[i] = " ";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function bestMove() {
  let bestScore = -Infinity;
  let move = 0;
  for (let i = 0; i < gameBoard.length; i++) {
    if (gameBoard[i] === " ") {
      gameBoard[i] = "O";
      let score = minimax(false);
      gameBoard[i] = " ";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function handleClick(event) {
  const index = event.target.getAttribute("data-index");
  if (gameBoard[index] === " " && currentPlayer === "X") {
    gameBoard[index] = "X";
    printBoard();
    if (checkWinner("X")) {
      message.textContent = "You win!";
      board.removeEventListener("click", handleClick);
    } else if (isDraw()) {
      message.textContent = "It's a draw!";
    } else {
      currentPlayer = "O";
      const aiMove = bestMove();
      gameBoard[aiMove] = "O";
      printBoard();
      if (checkWinner("O")) {
        message.textContent = "AI wins!";
        board.removeEventListener("click", handleClick);
      } else if (isDraw()) {
        message.textContent = "It's a draw!";
      }
      currentPlayer = "X";
    }
  }
}

function resetGame() {
  gameBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  currentPlayer = "X";
  message.textContent = "";
  printBoard();
  board.addEventListener("click", handleClick);
}

board.addEventListener("click", handleClick);
resetButton.addEventListener("click", resetGame);

resetGame(); // Initial setup
