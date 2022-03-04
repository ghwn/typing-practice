const userInputForm = document.getElementById("user-input-form");
const randomWord = document.getElementById("random-word");
const countDown = document.getElementById("count-down");
const givenTimeMs = 31000; // 31초 뒤
let endTime = Date.now() + givenTimeMs;
const userInput = document.getElementById("user-input");
const resultReport = document.getElementById("result-report");
let words;

let correct = 0;
let incorrect = 0;

let countDownId;

userInputForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = randomWord.textContent;
    const userInput = event.target[0].value;

    if (answer == userInput) {
        correct += 1;
    } else {
        incorrect += 1;
    }
    event.target[0].value = "";
    randomWord.innerText = getRandomWord();
});

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function updateCountDown() {
    const remainingTime = endTime - Date.now();
    countDown.innerText = `${parseInt(remainingTime / 1000)}초`;
}

function timeoutEvent() {
    clearInterval(countDownId);
    userInput.disabled = true;

    createResultReport();
}

function createResultReport() {
    const title = document.createElement("h2");
    const numCorrect = document.createElement("span");
    const numIncorrect = document.createElement("span");
    const correctRatio = document.createElement("span");

    title.innerText = "타자연습 결과";
    numCorrect.innerText = correct;
    numIncorrect.innerText = incorrect;

    if (correct + incorrect === 0) {
        correctRatio.innerText = "0%";
    } else {
        correctRatio.innerText = `${((correct / (correct + incorrect)) * 100).toFixed(2)}%`;
    }

    const numCorrectLabel = document.createElement("h3");
    numCorrectLabel.innerText = "맞힌 개수: ";
    const numIncorrectLabel = document.createElement("h3");
    numIncorrectLabel.innerText = "틀린 개수: ";
    const correctRatioLabel = document.createElement("h3");
    correctRatioLabel.innerText = "정답률: ";

    numCorrectLabel.appendChild(numCorrect);
    numIncorrectLabel.appendChild(numIncorrect);
    correctRatioLabel.appendChild(correctRatio);

    const restartButton = document.createElement("button");
    restartButton.id = "restart-button";
    restartButton.type = "button";
    restartButton.innerText = "재시작";
    restartButton.addEventListener("click", () => {
        resultReport.innerHTML = null;
        countDownId = setInterval(updateCountDown, 1000);
        setTimeout(timeoutEvent, givenTimeMs);
        endTime = Date.now() + givenTimeMs;
        randomWord.innerText = getRandomWord();
        correct = 0;
        incorrect = 0;
        userInput.value = "";
        userInput.disabled = false;
        userInput.focus();
    });

    resultReport.appendChild(title);
    resultReport.appendChild(numCorrectLabel);
    resultReport.appendChild(numIncorrectLabel);
    resultReport.appendChild(correctRatioLabel);
    resultReport.appendChild(restartButton);
}

(async () => {
    countDownId = setInterval(updateCountDown, 1000);
    setTimeout(timeoutEvent, givenTimeMs);
    userInput.focus();
    const response = await fetch("https://random-word-api.herokuapp.com/word?number=100");
    words = await response.json();
    randomWord.innerText = words[0];
})();
