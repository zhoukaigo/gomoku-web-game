document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const size = 15;
    let currentPlayer = 'black';
    let gameBoard = Array(size).fill().map(() => Array(size).fill(null));

    // Initialize the board
    function initializeBoard() {
        board.innerHTML = '';
        gameBoard = Array(size).fill().map(() => Array(size).fill(null));
        currentPlayer = 'black';
        status.textContent = 'Your turn (Black)';

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', handleCellClick);
                board.appendChild(cell);
            }
        }
    }

    // Handle cell click
    function handleCellClick(e) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);

        if (gameBoard[row][col] !== null) return;

        gameBoard[row][col] = currentPlayer;
        e.target.classList.add(currentPlayer);

        if (checkWin(row, col)) {
            status.textContent = `${currentPlayer === 'black' ? 'Black' : 'White'} wins!`;
            board.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleCellClick));
            return;
        }

        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        status.textContent = currentPlayer === 'black' ? 'Your turn (Black)' : 'Computer\'s turn (White)';

        if (currentPlayer === 'white') {
            setTimeout(computerMove, 500);
        }
    }

    // Check for a win
    function checkWin(row, col) {
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1] // horizontal, vertical, diagonal down, diagonal up
        ];

        for (const [dx, dy] of directions) {
            let count = 1;

            for (let i = 1; i <= 4; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size || gameBoard[newRow][newCol] !== currentPlayer) break;
                count++;
            }

            for (let i = 1; i <= 4; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size || gameBoard[newRow][newCol] !== currentPlayer) break;
                count++;
            }

            if (count >= 5) return true;
        }

        return false;
    }

    // Computer's move (simple AI)
    function computerMove() {
        const emptyCells = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (gameBoard[i][j] === null) emptyCells.push([i, j]);
            }
        }

        if (emptyCells.length === 0) return;

        const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        gameBoard[row][col] = 'white';
        const cell = board.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('white');

        if (checkWin(row, col)) {
            status.textContent = 'White wins!';
            board.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleCellClick));
            return;
        }

        currentPlayer = 'black';
        status.textContent = 'Your turn (Black)';
    }

    // Reset the game
    resetButton.addEventListener('click', initializeBoard);

    // Initialize the game
    initializeBoard();
});