let focusTime = 0;
let breakTime = 0;
let untrackedTime = 0;
let focusSessions = 0;
let breakSessions = 0;
let untrackedSessions = 0;
let divisor = 5;
let mode = "Untracked";
let intervalId = null;

function startFocus() {
    if (mode === "Focus") return;
    mode = "Focus";
    focusSessions++;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        focusTime++;
        breakTime = Math.floor(focusTime / divisor);
        updateDisplay();
    }, 1000);
}

function startBreak() {
    if (mode === "Break" || breakTime <= 0) return;
    mode = "Break";
    breakSessions++;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        if (breakTime > 0) {
            breakTime--;
            updateDisplay();
        } else {
            startUntracked();
        }
    }, 1000);
}

function startUntracked() {
    if (mode === "Untracked") return;
    mode = "Untracked";
    untrackedSessions++;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        untrackedTime++;
        updateDisplay();
    }, 1000);
}

function applyDivisor() {
    divisor = document.getElementById("divisorInput").value;
    breakTime = Math.floor(focusTime / divisor);
    updateDisplay();
}

function reset() {
    clearInterval(intervalId);
    focusTime = 0;
    breakTime = 0;
    untrackedTime = 0;
    focusSessions = 0;
    breakSessions = 0;
    untrackedSessions = 0;
    divisor = 5;
    mode = "Untracked";
    updateDisplay();
}

function updateDisplay() {
    document.getElementById("clock").innerText = formatTime(mode === "Break" ? breakTime : mode === "Focus" ? focusTime : untrackedTime);
    document.getElementById("statusText").innerText = mode;
    document.getElementById("availableBreak").innerText = formatTime(breakTime);
    document.getElementById("totalFocus").innerText = formatTime(focusTime);
    document.getElementById("focusSessions").innerText = focusSessions;
    document.getElementById("totalBreak").innerText = formatTime(breakTime);
    document.getElementById("breakSessions").innerText = breakSessions;
    document.getElementById("totalUntracked").innerText = formatTime(untrackedTime);
    document.getElementById("untrackedSessions").innerText = untrackedSessions;
}

function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    seconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

window.onload = function() {
    updateDisplay();
}