function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create 2d array of board
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < columns; c++) {
            board[r].push(Cell());
        };
    };

    // Print board to console
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return {
        printBoard
    }
};

gameBoard().printBoard() // Test printBoard

// Create cells in game board squares
function Cell() {
    let value = "[ ]";

    const getValue = () => value;

    return {
        getValue
    };
};