class GomokuGame {
    constructor() {
        this.canvas = document.getElementById('gomoku-board');
        this.ctx = this.canvas.getContext('2d');
        this.boardSize = 15; // 15x15 棋盘
        this.cellSize = this.canvas.width / this.boardSize;
        this.currentPlayer = 1; // 1: 黑棋, 2: 白棋
        this.board = [];
        this.gameOver = false;
        
        this.initializeBoard();
        this.drawBoard();
        this.setupEventListeners();
        this.updateGameInfo();
    }

    initializeBoard() {
        // 初始化空棋盘
        this.board = [];
        for (let i = 0; i < this.boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i][j] = 0; // 0表示空位
            }
        }
    }

    drawBoard() {
        const ctx = this.ctx;
        
        // 清空画布
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制棋盘背景
        ctx.fillStyle = '#deb887';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格线
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < this.boardSize; i++) {
            // 横线
            ctx.beginPath();
            ctx.moveTo(this.cellSize / 2, i * this.cellSize + this.cellSize / 2);
            ctx.lineTo(this.canvas.width - this.cellSize / 2, i * this.cellSize + this.cellSize / 2);
            ctx.stroke();
            
            // 竖线
            ctx.beginPath();
            ctx.moveTo(i * this.cellSize + this.cellSize / 2, this.cellSize / 2);
            ctx.lineTo(i * this.cellSize + this.cellSize / 2, this.canvas.height - this.cellSize / 2);
            ctx.stroke();
        }
        
        // 绘制天元和星位
        const starPoints = [3, 7, 11]; // 15x15棋盘的星位
        ctx.fillStyle = '#8b4513';
        
        for (let i of starPoints) {
            for (let j of starPoints) {
                ctx.beginPath();
                ctx.arc(
                    i * this.cellSize + this.cellSize / 2,
                    j * this.cellSize + this.cellSize / 2,
                    4, 0, Math.PI * 2
                );
                ctx.fill();
            }
        }
        
        // 绘制棋子
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] !== 0) {
                    this.drawPiece(i, j, this.board[i][j]);
                }
            }
        }
    }

    drawPiece(row, col, player) {
        const ctx = this.ctx;
        const x = col * this.cellSize + this.cellSize / 2;
        const y = row * this.cellSize + this.cellSize / 2;
        const radius = this.cellSize * 0.4;
        
        // 创建棋子渐变效果
        const gradient = ctx.createRadialGradient(
            x - radius * 0.3, y - radius * 0.3, radius * 0.1,
            x, y, radius
        );
        
        if (player === 1) { // 黑棋
            gradient.addColorStop(0, '#666');
            gradient.addColorStop(1, '#000');
        } else { // 白棋
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(1, '#ccc');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 棋子边框
        ctx.strokeStyle = player === 1 ? '#333' : '#999';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            if (this.gameOver) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const col = Math.round((x - this.cellSize / 2) / this.cellSize);
            const row = Math.round((y - this.cellSize / 2) / this.cellSize);
            
            if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
                this.placePiece(row, col);
            }
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
    }

    placePiece(row, col) {
        // 检查位置是否为空
        if (this.board[row][col] !== 0) {
            return;
        }
        
        // 放置棋子
        this.board[row][col] = this.currentPlayer;
        this.drawBoard();
        
        // 检查是否获胜
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            const winner = this.currentPlayer === 1 ? '黑棋' : '白棋';
            document.getElementById('game-status').textContent = `${winner}获胜！`;
            document.getElementById('game-status').style.color = '#e74c3c';
            return;
        }
        
        // 切换玩家
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.updateGameInfo();
    }

    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 右下对角线
            [1, -1]   // 右上对角线
        ];
        
        for (let [dx, dy] of directions) {
            let count = 1; // 当前位置已经有一个棋子
            
            // 正向检查
            for (let i = 1; i <= 4; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;
                if (newRow >= 0 && newRow < this.boardSize && 
                    newCol >= 0 && newCol < this.boardSize && 
                    this.board[newRow][newCol] === player) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 反向检查
            for (let i = 1; i <= 4; i++) {
                const newRow = row - dx * i;
                const newCol = col - dy * i;
                if (newRow >= 0 && newRow < this.boardSize && 
                    newCol >= 0 && newCol < this.boardSize && 
                    this.board[newRow][newCol] === player) {
                    count++;
                } else {
                    break;
                }
            }
            
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }

    updateGameInfo() {
        const playerText = this.currentPlayer === 1 ? '黑棋' : '白棋';
        document.getElementById('current-player').textContent = playerText;
        document.getElementById('current-player').style.color = 
            this.currentPlayer === 1 ? '#000' : '#fff';
        document.getElementById('current-player').style.backgroundColor = 
            this.currentPlayer === 1 ? '#f0f0f0' : '#333';
        document.getElementById('current-player').style.padding = '2px 8px';
        document.getElementById('current-player').style.borderRadius = '4px';
    }

    restartGame() {
        this.initializeBoard();
        this.currentPlayer = 1;
        this.gameOver = false;
        this.drawBoard();
        this.updateGameInfo();
        document.getElementById('game-status').textContent = '游戏进行中';
        document.getElementById('game-status').style.color = '#27ae60';
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new GomokuGame();
});