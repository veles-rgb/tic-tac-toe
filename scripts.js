function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create 2d array of board
    for (let r = 0; r < rows; r++) {
        board[r] = []; // Each board row becomes an array
        for (let c = 0; c < columns; c++) {
            board[r].push(Cell()); // For each row add array of 3 cells
        };
    };

    // Print board to console
    const printBoard = () => {
        // Transform the board into a nested array of cell values by mapping over rows and their cells
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return {
        printBoard // Make accessible to application
    }
};

// Create cells in game board squares
function Cell() {
    let value = " "; // Set empty space as default value

    const getValue = () => value; // Get / set value for each cell

    return {
        getValue // Make accessible to application
    };
};

// Test printBoard
gameBoard().printBoard()