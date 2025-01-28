function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < columns; c++) {
            board[r].push(Cell());
        }
    }

    const getBoard = () => board;

    function placeSymbol(row, column, player) {
        const cellChoice = board[row][column]

        if (cellChoice.getValue() === "") {
            cellChoice.setValue(player)
            return true
        } else {
            return false
        }
    };

    function displayBoard() {
        const printBoard = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(printBoard);
    };

    return { getBoard, placeSymbol, displayBoard };
};

function Cell() {
    let value = "";

    const setValue = (player) => {
        value = player
    };

    const getValue = () => value;

    return { setValue, getValue };
};

function gameController(
    playerOneName = "Player 1",
    playerTwoName = "Player 2"
) {
    const board = gameBoard();

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

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        if (activePlayer === players[0]) {
            activePlayer = players[1];
        } else if (activePlayer === players[1]) {
            activePlayer = players[0];
        };
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.displayBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    }

    const playRound = (row, column) => {
        if (!board.placeSymbol(row, column, getActivePlayer().symbol)) {
            console.log("You cannot place your symbol here!")
            !switchPlayerTurn();
        } else {
            console.log(`Placing ${getActivePlayer().name}'s ${getActivePlayer().symbol} in row ${row}, column ${column}`);
            board.placeSymbol(row, column, getActivePlayer().symbol);
        }

        const checkWinner = () => {
            
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return { playRound, getActivePlayer };
};

const game = gameController();