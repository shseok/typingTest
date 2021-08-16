// Variable
const GAME_TIME = 10;
const requestURL = 'https://random-word-api.herokuapp.com/word?number=100';

let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];

const wordDisplay = document.querySelector(".word-display");
const wordInput = document.querySelector(".word-input");
const scoreDisplay = document.querySelector(".score");
const timeDisplay = document.querySelector(".time");
const button = document.querySelector(".button");


const buttonChange = (text) => {
    button.innerText = text;
    text === '게임시작' ? button.classList.remove('loading') : button.classList.add('loading');
}
// console.log(wordInput);

// Call Word
const getWords = () => {
    axios.get(requestURL)
        .then(function (response) {
            // handle success
            words = response.data.filter((word) => word.length < 10);
            buttonChange('게임시작');
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}
// Progress Check
const checkStatus = () => {
    if (!isPlaying && time === 0) {
        buttonChange('게임시작');
        clearInterval(timeInterval);
    }
}

const init = () => {
    buttonChange('게임로딩 중...')
    getWords();
    wordInput.addEventListener('input', checkMatch);
// button.addEventListener('click', run); // 이렇게 해도 되지만 HTML에서 onClick으로 대체
}
// Running The Game
const run = () => {
    if (isPlaying) // 버튼 눌렀을 때 계속 실행 방지
        return;
    clearInterval(timeInterval); // 버튼 누른 현상이 누적될 수록 숫자의 카운트 속도가 빨라지는 현상 방지
    isPlaying = true;
    time = GAME_TIME;
    wordInput.focus();
    scoreDisplay.innerText = 0;
    timeInterval = setInterval(countDown, 1000); // when button is clicked
    checkInterval = setInterval(checkStatus, 50);
    buttonChange('게임중');
}

const countDown = () => {
    time > 0 ? time-- : isPlaying = false;
    if (!isPlaying)
        clearInterval(timeInterval);
    timeDisplay.innerText = time;
}
// Check Match Word
const checkMatch = () => {
    if (wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
        wordInput.value = "";
        if (!isPlaying) {
            runNotification('error');
            return; 
        }// 아래 로직 실행 x
        score++;
        scoreDisplay.innerText = score;
        time = GAME_TIME;
        const randomIndex = Math.floor(Math.random() * words.length);
        wordDisplay.innerText = words[randomIndex];
        runNotification('success');
    }
}

const runNotification = (type) =>{
    // Toastify Options
    const option = {
        text: `${wordDisplay.innerText}!!`,
        duration: 3000,
        newWindow: true,
        gravity: "top",
        position: "left", // `left`, `center` or `right`
        backgroundColor: "linear-gradient(to right, #8A2BE2, #0000FF)"
    }
    if (type === 'error') {
        option.text = '게임시작 버튼을 눌러주세요 :)'
        option.position = "right"
        option.backgroundColor = "red"
    }

    Toastify(option).showToast();
}

init();