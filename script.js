let focusTime = 0;
let currentFocusTime = 0;
let breakTime = 0;
let totalBreakTime = 0;
let untrackedTime = 0;
let focusSessions = 0;
let breakSessions = 0;
let untrackedSessions = 0;
let divisor = 3;
let mode = "Untracked";
let timer;
let titleEmoji = "🟡";

window.onload = function() {
    loadState();
    updateDisplay();
}

document.addEventListener('DOMContentLoaded', function () {
    if (!Notification) {
      alert('Desktop notifications not available in your browser. Try Chromium.'); 
      return;
    }
  
    if (Notification.permission !== 'granted')
      Notification.requestPermission();
  });

function startFocus() {
    clearInterval(timer);
    mode = "Focus";
    currentFocusTime = 0;
    timer = setInterval(function() {
        focusTime++;
        currentFocusTime++;
        if (currentFocusTime % divisor === 0) {
            breakTime++;
        }
        titleEmoji = titleEmoji === "🔴" ? "🔴" : "🔴";
        updateDisplay();
    }, 1000);
    focusSessions++;
}

function startBreak() {
    if (breakTime > 0) {
        clearInterval(timer);
        mode = "Break";
        timer = setInterval(function() {
            breakTime--;
            totalBreakTime++;
            if (breakTime === 0) {
                startUntracked();
                if (Notification.permission === "granted") {
                    new Notification('Break ended', {
                        body: 'Your break has ended. Time to get back to work!',
                    });
                }
            }
            updateDisplay();
        }, 1000);
        breakSessions++;
    }
}

function startUntracked() {
    clearInterval(timer);
    mode = "Untracked";
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
    totalBreakTime = 0;
    untrackedTime = 0;
    focusSessions = 0;
    breakSessions = 0;
    untrackedSessions = 0;
    mode = "Untracked";
    updateDisplay();
}

function updateDisplay() {
    let clockTime = formatTime(mode === "Focus" ? currentFocusTime : mode === "Break" ? breakTime : untrackedTime);
    document.getElementById("clock").innerText = clockTime;
    let statusText = document.getElementById("statusText");
    statusText.innerText = mode;
    if (mode === "Focus") {
        statusText.style.color = "var(--color-dark-red)";
    } else if (mode === "Break") {
        statusText.style.color = "var(--color-dark-green)";
    } else {
        statusText.style.color = "var(--color-dark-yellow)";
    }
    document.getElementById("availableBreak").innerText = formatTime(breakTime);
    document.getElementById("totalFocus").innerText = formatTime(focusTime);
    document.getElementById("focusSessions").innerText = focusSessions;
    document.getElementById("totalBreak").innerText = formatTime(totalBreakTime);
    document.getElementById("breakSessions").innerText = breakSessions;
    document.getElementById("totalUntracked").innerText = formatTime(untrackedTime);
    document.getElementById("untrackedSessions").innerText = untrackedSessions;
    document.title = mode === "Focus" ? `${titleEmoji} F ${clockTime}` : mode === "Break" ? `🟢 B ${clockTime}` : `🟡 U`;
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
        totalBreakTime: totalBreakTime,
        untrackedTime: untrackedTime,
        focusSessions: focusSessions,
        breakSessions: breakSessions,
        untrackedSessions: untrackedSessions,
        divisor: divisor,
        mode: mode
    }));
}

function loadState() {
    let savedState = JSON.parse(localStorage.getItem("flowtime"));
    if (savedState) {
        focusTime = savedState.focusTime;
        currentFocusTime = savedState.currentFocusTime;
        breakTime = savedState.breakTime;
        totalBreakTime = savedState.totalBreakTime;
        untrackedTime = savedState.untrackedTime;
        focusSessions = savedState.focusSessions;
        breakSessions = savedState.breakSessions;
        untrackedSessions = savedState.untrackedSessions;
        divisor = savedState.divisor;
        mode = savedState.mode;
    }
}