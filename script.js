/* 
COPILOT PROMPT 4: Game Logic Implementation Prompt
"Write JavaScript class-based code for whack-a-mole game logic including random mole positioning, 
score tracking, timer countdown, and game state management (start, active, end states)."
*/
class WhackAMoleGame {
    constructor() {
        this.score = 0;
        this.timeLeft = 30;
        this.gameActive = false;
        this.currentMole = null;
        this.moleTimeout = null;
        this.gameTimer = null;
        this.moleSpeed = 2000; // Initial mole appearance time
        this.difficultyLevel = 1;
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.createGrid();
        this.updateDisplay();
    }

    createGrid() {
        const gameGrid = document.getElementById('gameGrid');
        gameGrid.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.className = 'hole';
            hole.dataset.index = i;
            
            const mole = document.createElement('div');
            mole.className = 'mole';
            mole.addEventListener('click', () => this.whackMole(i));
            
            hole.appendChild(mole);
            gameGrid.appendChild(hole);
        }
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
    }

    startGame() {
        this.gameActive = true;
        this.score = 0;
        this.timeLeft = 30;
        this.moleSpeed = 2000;
        this.difficultyLevel = 1;
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('resetBtn').disabled = false;
        
        this.updateDisplay();
        this.startTimer();
        this.showMole();
    }

    startTimer() {
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            // Increase difficulty every 10 seconds
            if (this.timeLeft % 10 === 0 && this.timeLeft > 0) {
                this.increaseDifficulty();
            }
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    /* 
    COPILOT PROMPT 5: Progressive Difficulty Prompt
    "Implement a difficulty system that increases mole speed every 10 seconds during gameplay. 
    Start with 2-second intervals and reduce to minimum 0.5 seconds. Show difficulty level indicator to the user."
    */
    increaseDifficulty() {
        this.difficultyLevel++;
        this.moleSpeed = Math.max(500, this.moleSpeed - 300); // Minimum 500ms
        
        let difficultyText = 'Easy';
        if (this.difficultyLevel >= 2) difficultyText = 'Medium';
        if (this.difficultyLevel >= 3) difficultyText = 'Hard';
        if (this.difficultyLevel >= 4) difficultyText = 'Expert';
        
        document.getElementById('difficulty').textContent = difficultyText;
    }

    showMole() {
        if (!this.gameActive) return;
        
        // Hide current mole if exists
        if (this.currentMole !== null) {
            this.hideMole();
        }
        
        // Show new mole at random position
        const randomIndex = Math.floor(Math.random() * 9);
        this.currentMole = randomIndex;
        
        const mole = document.querySelector(`[data-index="${randomIndex}"] .mole`);
        mole.classList.add('show');
        
        // Hide mole after a delay
        this.moleTimeout = setTimeout(() => {
            this.hideMole();
            // Show next mole
            setTimeout(() => this.showMole(), 200);
        }, this.moleSpeed);
    }

    hideMole() {
        if (this.currentMole !== null) {
            const mole = document.querySelector(`[data-index="${this.currentMole}"] .mole`);
            mole.classList.remove('show');
            this.currentMole = null;
        }
    }

    whackMole(index) {
        if (!this.gameActive || this.currentMole !== index) return;
        
        const mole = document.querySelector(`[data-index="${index}"] .mole`);
        const hole = document.querySelector(`[data-index="${index}"]`);
        
        // Add hit animation
        mole.classList.add('hit');
        
        // Show score popup
        this.showScorePopup(hole, '+10');
        
        // Update score
        this.score += 10;
        this.updateDisplay();
        
        // Clear timeout and hide mole
        clearTimeout(this.moleTimeout);
        this.hideMole();
        
        // Remove hit animation
        setTimeout(() => {
            mole.classList.remove('hit');
        }, 300);
        
        // Show next mole after brief delay
        setTimeout(() => this.showMole(), 300);
    }

    showScorePopup(hole, text) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = text;
        hole.appendChild(popup);
        
        setTimeout(() => {
            if (hole.contains(popup)) {
                hole.removeChild(popup);
            }
        }, 1000);
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('timer').textContent = this.timeLeft;
    }

    endGame() {
        this.gameActive = false;
        clearInterval(this.gameTimer);
        clearTimeout(this.moleTimeout);
        this.hideMole();
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.add('show');
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('resetBtn').disabled = true;
    }

    resetGame() {
        this.gameActive = false;
        this.score = 0;
        this.timeLeft = 30;
        this.moleSpeed = 2000;
        this.difficultyLevel = 1;
        
        clearInterval(this.gameTimer);
        clearTimeout(this.moleTimeout);
        this.hideMole();
        
        document.getElementById('gameOver').classList.remove('show');
        document.getElementById('startBtn').disabled = false;
        document.getElementById('resetBtn').disabled = true;
        document.getElementById('difficulty').textContent = 'Easy';
        
        this.updateDisplay();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WhackAMoleGame();
});