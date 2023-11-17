let focusTime = 0;
let currentFocusTime = 0;
let breakTime = 0;
let untrackedTime = 0;
let focusSessions = 0;
let breakSessions = 0;
let untrackedSessions = 0;
let divisor = 5;
let status = "Untracked";
let timer;

window.onload = function() {
    loadState();
    updateDisplay();
}

function startFocus() {
    clearInterval(timer);
    status = "Focus";
    currentFocusTime = 0;
    timer = setInterval(function() {
        focusTime++;
        currentFocusTime++;
        if (currentFocusTime % divisor === 0) {
            breakTime++;
        }
        updateDisplay();
    }, 1000);
    focusSessions++;
}

function startBreak() {
    if (breakTime > 0) {
        clearInterval(timer);
        status = "Break";
        timer = setInterval(function() {
            breakTime--;
            if (breakTime === 0) {
                startUntracked();
            }
            updateDisplay();
        }, 1000);
        breakSessions++;
    }
}

function startUntracked() {
    clearInterval(timer);
    status = "Untracked";
    timer = setInterval(function() {
        untrackedTime++;
        updateDisplay();
    }, 1000);
    untrackedSessions++;
}

function applyDivisor() {
    divisor = document.getElementById("divisorInput").value;
    updateDisplay();
}

function reset() {
    clearInterval(timer);
    focusTime = 0;
    currentFocusTime = 0;
    breakTime = 0;
    untrackedTime = 0;
    focusSessions = 0;
    breakSessions = 0;
    untrackedSessions = 0;
    status = "Untracked";
    updateDisplay();
}

function updateDisplay() {
    document.getElementById("clock").innerText = formatTime(status === "Focus" ? currentFocusTime : status === "Break" ? breakTime : untrackedTime);
    document.getElementById("statusText").innerText = status;
    document.getElementById("availableBreak").innerText = formatTime(breakTime);
    document.getElementById("totalFocus").innerText = formatTime(focusTime);
    document.getElementById("focusSessions").innerText = focusSessions;
    document.getElementById("totalBreak").innerText = formatTime(breakTime);
    document.getElementById("breakSessions").innerText = breakSessions;
    document.getElementById("totalUntracked").innerText = formatTime(untrackedTime);
    document.getElementById("untrackedSessions").innerText = untrackedSessions;
    saveState();
}

function formatTime(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function saveState() {
    localStorage.setItem("flowtime", JSON.stringify({
        focusTime: focusTime,
        currentFocusTime: currentFocusTime,
        breakTime: breakTime,
        untrackedTime: untrackedTime,
        focusSessions: focusSessions,
        breakSessions: breakSessions,
        untrackedSessions: untrackedSessions,
        divisor: divisor,
        status: status
    }));
}

function loadState() {
    let savedState = JSON.parse(localStorage.getItem("flowtime"));
    if (savedState) {
        focusTime = savedState.focusTime;
        currentFocusTime = savedState.currentFocusTime;
        breakTime = savedState.breakTime;
        untrackedTime = savedState.untrackedTime;
        focusSessions = savedState.focusSessions;
        breakSessions = savedState.breakSessions;
        untrackedSessions = savedState.untrackedSessions;
        divisor = savedState.divisor;
        status = savedState.status;
    }
}