var audioObj = {
    green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
    error: new Audio('https://s3-us-west-2.amazonaws.com/guylemon/Buzzer.mp3')
}
var power = false;
var strictMode = false;
var tileChoices = ["green", "red", "yellow", "blue"]
var simonMoves = [];
var playerIdx = 0;
var roundNr = 1;

var tiles = document.querySelector('.tiles');
var display = document.querySelector('#display');
var powerBtn = document.querySelector('#power');
var strictBtn = document.querySelector('#strict');
var startBtn = document.querySelector('#start');

powerBtn.addEventListener("change", function(e) {
    power = e.target.checked;
    resetGame();
    if (power) {
        strictBtn.disabled = false;
        updateDisplay(roundNr)
        lockState(false)
    } else {
        strictBtn.checked = false;
        strictBtn.disabled = true;
        updateDisplay('--')
        lockState(true);
    }
})

// function clickBtn(color) {
//     return function(e) {
//         //if player clicks
//         if (e.target.id) {
//             checkClick(e.target.id);
//             e.target.classList.add("light");
//         }
//     };
// }

function clickBtn(e) {
    checkClick(e.target.id);
    e.target.classList.add("light");
}

function removeClass(classString) {
    return function(e) {
        e.target.classList.remove(classString);
    };
}

function addClass(classString) {
    return function(e) {
        e.target.classList.add(classString);
    };
}

function lockState(bool) {
    if (!bool) {
        tiles.addEventListener("mousedown", clickBtn);
        tiles.addEventListener("mouseup", removeClass("light"));
        tiles.addEventListener("mouseout", removeClass("light"));
        strictBtn.addEventListener("change", strictBtnHdl);
        startBtn.addEventListener("click", startBtnHdl);

        //TEST MOMBILE TOUCHES
        tiles.addEventListener("touchstart", clickBtn);
        tiles.addEventListener("touchend", removeClass("light"));

    } else {
        tiles.removeEventListener("mousedown", clickBtn);
        strictBtn.removeEventListener("change", strictBtnHdl);
        startBtn.removeEventListener("click", startBtnHdl);
    }
}

function strictBtnHdl(e) {
    strictMode = e.target.checked;
}

function startBtnHdl() {
    if (power) {
        resetGame();
        loopMoves(simonMoves);
    }
}

function playAudio(audio) {
    audio.play();
}

function randomChoice(array) {
  var idx = Math.floor(Math.random() * array.length);
  return array[idx];
}

function animateBtn(color) {
    // if computer plays
    let element = document.querySelector(`#${color}`)
    playAudio(audioObj[color])
    element.classList.add("light");
    setTimeout(function () {
        element.classList.remove("light");
    }, 800);
}

function loopMoves(moveArr) {
    lockState(true);
    for (let [idx, elem] of moveArr.entries()) {
        //use IIFE with right timeout length
        (function(idx) {
            setTimeout(function () {
                animateBtn(elem);
            }, 1000 * idx);
        })(idx);
    }
    //only remove lock after loop is finished playing
    setTimeout(function () {
        lockState(false);
    }, moveArr.length * 1000);
}

function checkClick(color) {
    if (color == simonMoves[playerIdx]) {
        playAudio(audioObj[color]);
        playerIdx++;
        if (playerIdx == simonMoves.length) {
            playerIdx = 0;
            roundNr++;
            if (roundNr > 5) {
                notifyWin();
            } else {
                updateDisplay(roundNr);
                simonMoves.push(randomChoice(tileChoices));
                setTimeout(function () {
                    loopMoves(simonMoves);
                }, 1000);
            }
        }
    } else {
        notifyError();
        if (strictMode) {
            resetGame();
        }
    }
}

function updateDisplay(text) {
    display.innerText = text;
}

function notifyError() {
    //need to set lockstate here to prevent double click looping of moves
    lockState(true);
    playerIdx = 0;
    updateDisplay('!!');
    playAudio(audioObj['error']);
    setTimeout(function () {
        updateDisplay(roundNr);
        loopMoves(simonMoves);
    }, 1000);
}

function notifyWin() {
    updateDisplay("WINNER WINNER CHICKEN DINNER!")
    document.querySelector("body").classList.add("win");
    lockState(true);
}

function resetGame() {
    simonMoves = [];
    simonMoves.push(randomChoice(tileChoices));
    playerIdx = 0;
    roundNr = 1;
    document.querySelector("body").classList.remove("win");
}
