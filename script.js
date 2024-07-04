const gameboard = (() =>{
    let gameboard = ["", "", "", "", "", "", "", "", ""];
    
    const render = () => {
        const gameboardHTML = document.querySelector("#gameboard");
        gameboardHTML.innerHTML= "";
        gameboard.forEach((square, index) =>{
            const squareNode = document.createElement('div');
            squareNode.classList.add("square");
            squareNode.id = "square-" + index;
            squareNode.innerHTML = square;
            if (square === ""){
                squareNode.addEventListener("click", game.handleClick);
            }
            gameboardHTML.appendChild(squareNode)
            const text = document.querySelector("#text");
            text.textContent = "It's " + game.getCurrentPlayerName() + "'s turn.";
        });
    }

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }

    const getGameboard = () => gameboard;

    return {
        render,
        update,
        getGameboard,
    }
}) ();

const game = (() =>{
    let players = [];
    let currentPlayerIndex;
    let currentPlayerName;
    let gameOver;

    const start = () => {
        let player1Name = document.querySelector("#player1").value;
        let player2Name = document.querySelector("#player2").value;
        if (player1Name === ""){
            player1Name = "Player 1"
        }
        if (player2Name === ""){
            player2Name = "Player 2"
        }
        players = [
            createPlayer(player1Name, "X"),
            createPlayer(player2Name, "O")
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        const inputs = document.querySelector("#input-area");
        inputs.remove();  
        
        const gameboardArea = document.querySelector("#gameboard-area");
        const restartButton = document.createElement("button");
        restartButton.classList.add("button");
        restartButton.id = "restartButton";
        restartButton.textContent = "Restart";
        restartButton.addEventListener("click", game.restart);
        gameboardArea.appendChild(restartButton);

        gameboard.render();
    }

    const handleClick = (e) => {
        if (gameOver !== true){
            const index = e.target.id.slice(-1);
            let previousPlayerIndex = currentPlayerIndex;
            currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
            currentPlayerName = players[currentPlayerIndex].name;
            gameboard.update(index, players[previousPlayerIndex].mark);
            if (checkForWin(gameboard.getGameboard(), players[previousPlayerIndex].mark)){
                gameOver = true;
                players[previousPlayerIndex].winGame();
                player1Dialog.textContent = players[0].name;
                player2Dialog.textContent = players[1].name;
                player1DialogScore.textContent = players[0].seeScore();
                player2DialogScore.textContent = players[1].seeScore();
                displayController.renderMessage(`${players[previousPlayerIndex].name} has won!`)
                gameOverDialog.showModal();
            } else if (checkforTie(gameboard.getGameboard())) {
                gameOver = true;
                displayController.renderMessage("It's a tie!")
                gameOverDialog.showModal();
            }
        }
    }

    const restart = () => {
        gameOver = false;
        currentPlayerIndex = 0;
        currentPlayerName = players[currentPlayerIndex].name;
        for (let i = 0 ; i < 9; i++){
            gameboard.update(i, "");
        }
    }

    const getCurrentPlayerName = () => {
        return players[currentPlayerIndex].name
    }

    return {
        start,
        handleClick,
        getCurrentPlayerName,
        restart,
    }
})();

const displayController = (() =>{
    const renderMessage = (message) => {
        document.querySelector("#game-over-text").innerHTML = message;
    }
    return{
        renderMessage
    }
})()

function checkForWin(gameboard){
    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < winCombos.length; i++){
        const [a, b, c] = winCombos[i];
        if (gameboard[a] && gameboard[a] === gameboard[b] && gameboard[a] === gameboard[c]){
            return true;
        }
    }
    return false
}

function checkforTie(gameboard) {
    return gameboard.every(cell => cell !== "");
}

// Players
function createPlayer(name, mark){
    let score = 0;
    const winGame = () => {
        score++;
    }
    const seeScore = () => {
        const seeScore = score;
        return seeScore;
    }
    return {
        name,
        mark,
        winGame,
        seeScore
    };
}

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
    game.start();
})

const gameOverDialog = document.querySelector(".dialog");
const closeDialogBtn = document.querySelector("#close-dialog");
closeDialogBtn.addEventListener("click", () => {
    gameOverDialog.close();
})
const playAgainBtn = document.querySelector("#play-again");
playAgainBtn.addEventListener("click", () => {
    gameOverDialog.close();
    game.restart();
})

const player1Dialog = document.querySelector("#player1-dialog");
const player2Dialog = document.querySelector("#player2-dialog");
const player1DialogScore = document.querySelector("#player1-dialog-score");
const player2DialogScore = document.querySelector("#player2-dialog-score");