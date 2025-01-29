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
        // If cell choice is not empty, replay turn.
        if (!board.placeSymbol(row, column, getActivePlayer().symbol)) {
            console.log("You cannot place your symbol here!");
            !switchPlayerTurn();
        } else {
            // Play turn if empty cell.
            console.log(`Placing ${getActivePlayer().name}'s ${getActivePlayer().symbol} in row ${row}, column ${column}`);
            board.placeSymbol(row, column, getActivePlayer().symbol);
        };

        // Switch player turn and print new round if turn successful.
        checkForWin()
        switchPlayerTurn();
        printNewRound();
    };

    const checkForWin = () => {
        const flatBoard = board.getBoard().flat()
        console.log(flatBoard)
    }

    // Print new round if player cannot place on cell.
    printNewRound();

    return { playRound, getActivePlayer };
};

const game = gameController();