let gameActive = true;
        let currentPlayer = 'X';
        let startingPlayer = 'X'; // Track who starts each game
        let gameState = ['', '', '', '', '', '', '', '', ''];
        let scores = { X: 0, O: 0 };

        // Elements
        const statusDisplay = document.getElementById('status');
        const cells = document.querySelectorAll('.cell');
        const restartButton = document.getElementById('restart-btn');
        const resetScoreButton = document.getElementById('reset-score-btn');
        const xScoreDisplay = document.getElementById('x-score');
        const oScoreDisplay = document.getElementById('o-score');
        const themeToggle = document.getElementById('theme-toggle-input');

        // Winning conditions
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        // Status messages
        const winningMessage = () => `Player ${currentPlayer} has won!`;
        const drawMessage = () => `Game ended in a draw!`;
        const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;

        // Theme toggle
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        }

        // Initialize game
        function initializeGame() {
            cells.forEach(cell => {
                cell.addEventListener('click', cellClicked);
                cell.classList.remove('x', 'o', 'win');
                cell.textContent = '';
            });
            
            restartButton.addEventListener('click', restartGame);
            resetScoreButton.addEventListener('click', resetScore);
            
            // Set current player to the starting player for this game
            currentPlayer = startingPlayer;
            statusDisplay.textContent = currentPlayerTurn();
            
            gameActive = true;
            updateScoreDisplay();
        }

        // Handle cell click
        function cellClicked(clickedCellEvent) {
            const clickedCell = clickedCellEvent.target;
            const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

            if (gameState[clickedCellIndex] !== '' || !gameActive) {
                return;
            }

            // Update game state
            gameState[clickedCellIndex] = currentPlayer;
            clickedCell.textContent = currentPlayer;
            clickedCell.classList.add(currentPlayer.toLowerCase());

            // Check for win or draw
            checkResult();
        }

        // Check for win or draw
        function checkResult() {
            let roundWon = false;
            let winCells = [];

            // Check for winning condition
            for (let i = 0; i < winningConditions.length; i++) {
                const [a, b, c] = winningConditions[i];
                
                if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                    continue;
                }
                
                if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                    roundWon = true;
                    winCells = [a, b, c];
                    break;
                }
            }

            // Handle win
            if (roundWon) {
                statusDisplay.textContent = winningMessage();
                gameActive = false;
                
                // Highlight winning cells
                winCells.forEach(index => {
                    document.querySelector(`.cell[data-index="${index}"]`).classList.add('win');
                });
                
                // Update score
                scores[currentPlayer]++;
                updateScoreDisplay();
                
                // Switch starting player for next game
                startingPlayer = startingPlayer === 'X' ? 'O' : 'X';
                return;
            }

            // Handle draw
            if (!gameState.includes('')) {
                statusDisplay.textContent = drawMessage();
                gameActive = false;
                
                // Switch starting player for next game
                startingPlayer = startingPlayer === 'X' ? 'O' : 'X';
                return;
            }

            // Switch player for next turn
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDisplay.textContent = currentPlayerTurn();
        }

        // Update score display
        function updateScoreDisplay() {
            xScoreDisplay.textContent = scores.X;
            oScoreDisplay.textContent = scores.O;
        }

        // Restart game
        function restartGame() {
            gameState = ['', '', '', '', '', '', '', '', ''];
            gameActive = true;
            
            // Use the new starting player
            currentPlayer = startingPlayer;
            
            statusDisplay.textContent = currentPlayerTurn();
            
            cells.forEach(cell => {
                cell.textContent = '';
                cell.classList.remove('x', 'o', 'win');
            });
        }

        // Reset score
        function resetScore() {
            scores.X = 0;
            scores.O = 0;
            updateScoreDisplay();
            
            // Reset starting player to X when scores are reset
            startingPlayer = 'X';
            
            restartGame();
        }

        // Start the game
        initializeGame();
