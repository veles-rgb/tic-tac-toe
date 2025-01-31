function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create 2D Array of game board.
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < columns; c++) {
            board[r].push(Cell());
        }
    }

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
    let gameOver = false

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

    // Get the active player...
    const getActivePlayer = () => activePlayer;

    // Display board for new round.
    const printNewRound = () => {
        board.displayBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    // Play round based on chosen row & column.
    const playRound = (row, column) => {
        if (gameOver) return;

        // If cell choice is not empty, replay turn, otherwise play.
        if (!board.placeSymbol(row, column, getActivePlayer().symbol)) {
            console.log("You cannot place your symbol here!");
            return
        }

        // If player can place symbol log in console.
        console.log(`Placing ${getActivePlayer().name}'s ${getActivePlayer().symbol} in row ${row}, column ${column}`);

        // Check for a win.
        if (checkForWin()) {
            console.log("Win check true.")
            gameOver = true
            return
        }

        // Check for a tie.
        if (checkForTie()) {
            console.log("Tie check true.")
            gameOver = true
            return
        }

        switchPlayerTurn();
        printNewRound();
    };

    const checkForWin = () => {
        // Turn 2D array of board into a flat array.
        const flatBoard = board.getBoard().flat()
        // map over flatBoard and replace each cell with its value.
        const mapFlatBoard = flatBoard.map(cell => cell.getValue())
        // Loop through winning combos and compare with mapFlatBoard indices.
        const winCombo = board.winCombinations;
        for (let combo = 0; combo < winCombo.length; combo++) {
            if (mapFlatBoard[winCombo[combo][0]] ===
                mapFlatBoard[winCombo[combo][1]] &&
                mapFlatBoard[winCombo[combo][1]] ===
                mapFlatBoard[winCombo[combo][2]] &&
                mapFlatBoard[winCombo[combo][2]] !== "") {
                console.log("Winning Combo detected");
                return true;
            };
        };
        return false;
    };

    const checkForTie = () => {
        const flatBoard = board.getBoard().flat();
        return flatBoard.every(cell => cell.getValue() !== "");
    };

    return { getBoard: board.getBoard, playRound, getActivePlayer };
};

function displayController() {
    const game = gameController();
    const turnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateDisplay = () => {
        // clear the board
        boardDiv.textContent = "";

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        turnDiv.textContent = `${activePlayer.name}'s turn.`;

        // Render board cells
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                // Create buttons for each cell
                const cellBtn = document.createElement("button");
                // Add cell class
                cellBtn.classList.add("cell");
                // Add dataset for row and column index
                const cellIndex = rowIndex * 3 + columnIndex;
                cellBtn.setAttribute("cell-index", cellIndex);
                // Change cell text content
                cellBtn.textContent = cell.getValue();
                // Append cell
                boardDiv.appendChild(cellBtn);
            });
        });
    };

    // Add event listener to board
    function boardClickHandler(e) {
        const selectedCell = e.target;
        const cellIndex = selectedCell.getAttribute("cell-index");

        if (!cellIndex) return;

        // Convert cellIndex to row and column
        const row = Math.floor(cellIndex / 3);
        const column = cellIndex % 3;

        game.playRound(row, column);
        updateDisplay();
    };

    boardDiv.addEventListener("click", boardClickHandler);

    updateDisplay();
};

displayController();

// TO DO // In no particular order.
// Add Winner message modal with restart button (find who the winner is.)
// Add modal for players names with start game button
// Add reset game button at bottom of page