let secToHML = (seconds) => {
    // 3600秒 = 1時間
    let hour = Math.floor(seconds / 3600);
    // 60秒 = 1分
    let min = Math.floor(seconds % 3600 / 60);
    // 余った秒数
    let sec = seconds % 60;
    let hh;
    if (hour < 100) {
        hh = (`00${hour}`).slice(-2);
    } else {
        hh = hour;
    }
    const mm = (`00${min}`).slice(-2);
    const ss = (`00${sec}`).slice(-2);
    return `${hh}:${mm}:${ss}`;
}

let timer = null;
let time = 0;
let endTime = 0;
let copyTime = 0;
let periodCount = 0;
let WORK_TIME = 1500;  // 25分（1500秒）
let SHORT_BREAK = 300;  // 5分（300秒）
let LONG_BREAK = 900;  // 15分（900秒）
let MAX_SESSIONS = 4;  // 4回

let start = document.getElementById('start');
let timerEl = document.getElementById('timer');
let pause = document.getElementById('pause');
let resume = document.getElementById('resume');
let reset = document.getElementById('reset');
let btnList = document.getElementById('btnList');
let period = document.getElementById('period');
let state = document.getElementById('state');
const endAudio = new Audio('決定ボタンを押す1.mp3');

timerEl.innerHTML = `${secToHML(WORK_TIME)}`
period.innerHTML = `0/${MAX_SESSIONS}`

const timerFunc = (num, endTime = WORK_TIME) => {
    clearInterval(timer);
    timerEl.innerHTML = secToHML(endTime - num);
    timer = setInterval(() => {
        num++;
        time = [num, endTime];
        if (endTime > num) {
            timerEl.innerHTML = secToHML(endTime - num);
        } else if (endTime === SHORT_BREAK) {
            clearInterval(timer);
            endAudio.play();
            timerFunc(0);
            periodCount++;
            period.innerHTML = `${periodCount}/${MAX_SESSIONS}`;
        } else if (endTime === LONG_BREAK) {
            clearInterval(timer);
            endAudio.play();
            timerEl.innerHTML = secToHML(0);
            period.innerHTML = `${MAX_SESSIONS}/${MAX_SESSIONS}`;
            state.innerHTML = '完了'
        } else {
            clearInterval(timer);
            endAudio.play();
            if (periodCount === MAX_SESSIONS - 1) {
                clearInterval(timer);
                timerFunc(0, LONG_BREAK);
                return;
            }
            timerFunc(0, SHORT_BREAK);
        }
    }, 1000)
}

//スタート
start.addEventListener('click', () => {
    timerFunc(0);
    periodCount = 0;
    state.innerHTML = '稼働中'
});
//一時停止
pause.addEventListener('click', () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
        copyTime = time;
        state.innerHTML = '一時停止中'
    }
})
//再開
resume.addEventListener('click', () => {
    if (copyTime !== 0) {
        timerFunc(...copyTime);
        state.innerHTML = '稼働中'
    }
})
//リセット
reset.addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
    copyTime = 0;
    periodCount = 0;
    timerEl.innerHTML = secToHML(WORK_TIME);
    period.innerHTML = `0/${MAX_SESSIONS}`;
    state.innerHTML = '停止中';
})

