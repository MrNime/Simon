var audio1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
var audio2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
var audio3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
var audio4 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
var audioError = new Audio('https://s3-us-west-2.amazonaws.com/guylemon/Buzzer.mp3');

var audioObj = {
    green: audio1,
    red: audio2,
    yellow: audio3,
    blue: audio4,
    error: audioError
}
var tileChoices = ["green", "red", "yellow", "blue"]
var simonMoves = ["green"];
var playerIdx = 0;
var roundNr = 1;
var tiles = document.querySelector('.tiles');
var display = document.querySelector('#display');

tiles.addEventListener("mousedown", clickBtn());
tiles.addEventListener("mouseup", removeClass("light"));
tiles.addEventListener("mouseout", removeClass("light"));

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

function playAudio(audio) {
    audio.play();
}

function randomChoice(array) {
  var idx = Math.floor(Math.random() * array.length);
  return array[idx];
}

function clickBtn(color) {
    return function(e) {
        //if player clicks
        if (e.target.id) {
            checkClick(e.target.id);
            e.target.classList.add("light");
        }
    };
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
    for (let [idx, elem] of moveArr.entries()) {
        //use IIFE with right timeout length
        (function(idx) {
            setTimeout(function () {
                animateBtn(elem);
            }, 1000 * idx);
        })(idx);
    }
}

function checkClick(color) {
    if (color == simonMoves[playerIdx]) {
        playAudio(audioObj[color]);
        playerIdx++;
        if (playerIdx == simonMoves.length) {
            playerIdx = 0;
            roundNr++;
            updateDisplay(roundNr);
            simonMoves.push(randomChoice(tileChoices));
            setTimeout(function () {
                loopMoves(simonMoves);
            }, 1000);
        }
    } else {
        notifyError();
    }
}

function updateDisplay(text) {
    display.innerText = text;
}

function notifyError() {
    playerIdx = 0;
    updateDisplay('!!');
    playAudio(audioObj['error']);
    setTimeout(function () {
        updateDisplay(roundNr);
        loopMoves(simonMoves);
    }, 1000);
}

loopMoves(simonMoves);
