function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create 2D Array of game board.
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < columns; c++) {
            board[r].push(Cell());
        };
    };

    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontally
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertically
        [0, 4, 8], [2, 4, 6] // Diagonally
    ];

    const getBoard = () => board;

    // Place symbol in cell if empty, otherwise return false.
    function placeSymbol(row, column, player) {
        const cellChoice = board[row][column];

        if (cellChoice.getValue() === "") {
            cellChoice.setValue(player);
            return true;
        } else {
            return false;
        };
    };

    // Display board in console with cell values.
    function displayBoard() {
        // Transform the board into a new 2D array containing the values of each cell, then print it.
        const printBoard = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(printBoard);
    };

    return { winCombinations, getBoard, placeSymbol, displayBoard };
};

// Get / Set cell values.
function Cell() {
    // Default value of empty.
    let value = "";

    // Change cell value to player symbol.
    const setValue = (player) => {
        value = player;
    };

    // Grab current cell value.
    const getValue = () => value;

    return { setValue, getValue };
};

// Controller of game...
function gameController(
    // Set default player names (can be changed in UI).
    playerOneName = "Player 1",
    playerTwoName = "Player 2"
) {
    const board = gameBoard();

    // Define players and their symbols.
    const players = [
        {
            name: playerOneName,
            symbol: "X"
        },
        {
            name: playerTwoName,
            symbol: "O"
        }
    ];

    // Game over flag.
    let gameOver = false;

    // Set active player.
    let activePlayer = players[0];

    // Switch active player based on turn.
    const switchPlayerTurn = () => {
        if (activePlayer === players[0]) {
            activePlayer = players[1];
        } else if (activePlayer === players[1]) {
            activePlayer = players[0];
        };
    };

    // Get the active player.
    const getActivePlayer = () => activePlayer;

    // Display board for new round.
    const printNewRound = () => {
        board.displayBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    // Play round based on chosen row & column.
    const playRound = (row, column) => {
        // End game if the game is over.
        if (gameOver) return;

        // If cell choice is not empty, replay turn, otherwise continue.
        if (!board.placeSymbol(row, column, getActivePlayer().symbol)) {
            console.log("You cannot place your symbol here!");
            return;
        };

        // If player can place symbol log in console.
        console.log(`Placing ${getActivePlayer().name}'s ${getActivePlayer().symbol} in row ${row}, column ${column}`);

        // Checks for win or tie.
        if (checkForWin()) {
            board.displayBoard();
            console.log(`${getActivePlayer().name} wins!`);
            gameOver = true;
            return;
        };
        if (checkForTie()) {
            board.displayBoard();
            console.log("It's a tie!");
            gameOver = true;
            return;
        };

        // If game not over and no win/tie continue.
        switchPlayerTurn();
        printNewRound();
    };

    const checkForWin = () => {
        // Turn 2D array of board into a flat array.
        const flatBoard = board.getBoard().flat();
        // map over flatBoard and replace each cell with its value.
        const mapFlatBoard = flatBoard.map(cell => cell.getValue());
        // Loop through winning combos and compare with mapFlatBoard indices.
        const winCombo = board.winCombinations;
        for (let combo = 0; combo < winCombo.length; combo++) {
            if (mapFlatBoard[winCombo[combo][0]] ===
                mapFlatBoard[winCombo[combo][1]] &&
                mapFlatBoard[winCombo[combo][1]] ===
                mapFlatBoard[winCombo[combo][2]] &&
                mapFlatBoard[winCombo[combo][2]] !== "") {
                return true;
            };
        };
        return false;
    };

    const checkForTie = () => {
        const flatBoard = board.getBoard().flat();
        return flatBoard.every(cell => cell.getValue() !== "");
    };

    return { getBoard: board.getBoard, playRound, getActivePlayer, gameOver, checkForWin, checkForTie, players };
};

function displayController(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const game = gameController(playerOneName, playerTwoName);
    const turnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    // Event listener function (must be the same reference for removeEventListener to work).
    function boardClickHandler(e) {
        const selectedCell = e.target;
        const cellIndex = selectedCell.getAttribute("cell-index");

        if (!cellIndex) return;

        const row = Math.floor(cellIndex / 3);
        const column = cellIndex % 3;

        // Play the round.
        game.playRound(row, column);
        updateDisplay();
    };

    // Function to remove event listener.
    function removeBoardClickListener() {
        boardDiv.removeEventListener("click", boardClickHandler);
    };

    // Update display.
    function updateDisplay() {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const gameOverModal = document.querySelector(".game-over-modal");

        function gameOverModalControl() {
            const gameOverModalBtn = document.querySelector(".game-over-modal .restart-btn");
            const boardRestartBtn = document.querySelector(".game-container .restart-btn");
            gameOverModal.showModal();
            gameOverModalBtn.style.display = "block";
            boardRestartBtn.style.display = "none";
        };

        // Check for win or tie.
        if (game.checkForWin()) {
            turnDiv.textContent = `${activePlayer.name} wins!`;
            game.gameOver = true;
            removeBoardClickListener();
            gameOverModalControl();
        } else if (game.checkForTie()) {
            turnDiv.textContent = "It's a tie!";
            game.gameOver = true;
            removeBoardClickListener();
            gameOverModalControl();
        } else {
            turnDiv.textContent = `${activePlayer.name}'s turn.`;
        }

        // Display the board cells
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellBtn = document.createElement("button");
                cellBtn.classList.add("cell");
                const cellIndex = rowIndex * 3 + columnIndex;
                cellBtn.setAttribute("cell-index", cellIndex);
                cellBtn.textContent = cell.getValue();
                boardDiv.appendChild(cellBtn);
            });
        });
    };

    // Attach event listener ONCE.
    boardDiv.addEventListener("click", boardClickHandler);

    updateDisplay();
};

// IIFE for button / modal variables and eventListeners.
(function () {
    const startBtn = document.querySelector(".start-btn");
    const playerNameModal = document.querySelector(".name-modal");
    const startGameBtn = document.querySelector(".start-game-btn");
    const playerOneInput = document.querySelector("#player1name");
    const playerTwoInput = document.querySelector("#player2name");
    const closeModalBtn = document.querySelector(".close-modal-btn");
    const hiddenGameBoard = document.querySelector(".board");
    const restartBtn = document.querySelectorAll(".restart-btn");

    startBtn.addEventListener("click", () => {
        playerNameModal.showModal();
    });

    closeModalBtn.addEventListener("click", () => {
        playerNameModal.close();
    });

    startGameBtn.addEventListener("click", () => {
        const playerOneName = playerOneInput.value || "Player 1";
        const playerTwoName = playerTwoInput.value || "Player 2";

        displayController(playerOneName, playerTwoName);
        playerNameModal.close();
        startBtn.remove();
        // Change display of .board to grid (was none).
        hiddenGameBoard.style.display = "grid";
        // Change display of all restart buttons to block (was none).
        restartBtn.forEach(e => {
            e.style.display = "block";
        });
    });

    function restartGame() {
        console.log("Game restarting...");

        // Remove the old board event listener.
        const boardDiv = document.querySelector(".board");
        const newBoardDiv = boardDiv.cloneNode(true);
        boardDiv.parentNode.replaceChild(newBoardDiv, boardDiv);

        // Get current player names.
        const playerOneName = document.querySelector("#player1name").value || "Player 1";
        const playerTwoName = document.querySelector("#player2name").value || "Player 2";

        // Start a fresh game.
        displayController(playerOneName, playerTwoName);
    }

    // Add event listener to both restart buttons.
    restartBtn.forEach(e => {
        e.addEventListener("click", () => {
            restartGame();
            document.querySelector(".game-over-modal").close();
            document.querySelector(".game-container .restart-btn").style.display = "block";
        });
    });
})()