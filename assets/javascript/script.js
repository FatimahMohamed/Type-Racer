const sampleTexts = {
    easy: [
        "The cat sat on the mat.",
        "Dogs bark at night.",
        "I like to read books."
    ],
    medium: [
        "Typing quickly improves your accuracy.",
        "Practice makes perfect in every skill.",
        "The quick brown fox jumps over the lazy dog."
    ],
    hard: [
        "Sphinx of black quartz, judge my vow.",
        "Pack my box with five dozen liquor jugs.",
        "The five boxing wizards jump quickly."
    ]
};

const select = document.getElementById('inputGroupSelect01');
const typingTextBox = document.getElementById('typingTextBox');
const retryButton = document.querySelector('.typeracer-action-btn');
const timeResultDiv = document.querySelector('.results-inner-box > div:nth-child(3)');
const wpmResultDiv = document.querySelector('.results-inner-box > div:nth-child(4)');
const levelResultDiv = document.querySelector('.results-inner-box > div:nth-child(2)');
const typingInput = document.querySelector('.typing-input-multiline');



let startTime = null;
let endTime = null;
let timerRunning = false;
let testStarted = false;

function getDifficulty() {
    const value = select.value;
    if (value === "1") return "medium";
    if (value === "2") return "hard";
    return "easy";
}

function setRandomText() {
    const level = getDifficulty();
    const texts = sampleTexts[level];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    typingTextBox.textContent = randomText;
}

function startTest() {
    if (testStarted) return;
    startTime = performance.now();
    endTime = null;
    timerRunning = true;
    testStarted = true;
    typingInput.disabled = false;
    // Optionally clear previous time
    updateTimeResult(0);
}

function stopTest() {
    if (!timerRunning) return;
    endTime = performance.now();
    timerRunning = false;
    testStarted = false;
    typingInput.disabled = true; // Disable textarea when test stops
    const elapsedSeconds = ((endTime - startTime) / 1000);
    updateTimeResult(elapsedSeconds);

    // Calculate WPM and update results
    const sampleText = getSampleText();
    const userInput = getUserInput();
    const correctWords = countCorrectWords(sampleText, userInput);
    const minutes = elapsedSeconds / 60;
    const wpm = minutes > 0 ? Math.round(correctWords / minutes) : 0;
    updateWPMResult(wpm);

    // Update level display
    const level = getDifficulty();
    updateLevelResult(level);
}

function updateTimeResult(seconds) {
    if (timeResultDiv) {
        timeResultDiv.textContent = `Time: ${seconds.toFixed(2)}s`;
    }
}

function getSampleText() {
    return typingTextBox.textContent.trim();
}

function getUserInput() {
    return typingInput.value.trim();
}

function countCorrectWords(sample, user) {
    const sampleWords = sample.split(/\s+/);
    const userWords = user.split(/\s+/);
    let correct = 0;
    for (let i = 0; i < Math.min(sampleWords.length, userWords.length); i++) {
        if (sampleWords[i] === userWords[i]) {
            correct++;
        }
    }
    return correct;
}

function updateWPMResult(wpm) {
    if (wpmResultDiv) {
        wpmResultDiv.textContent = `WPM: ${wpm}`;
    }
}

function updateLevelResult(level) {
    if (levelResultDiv) {
        // Capitalize first letter
        levelResultDiv.textContent = `Level: ${level.charAt(0).toUpperCase() + level.slice(1)}`;
    }
}

// Ensure initial button states
function initializeTestButtons() {
    testStarted = false;
    timerRunning = false;
    typingInput.value = '';
    typingInput.disabled = false;
}

select.addEventListener('change', setRandomText);
retryButton.addEventListener('click', () => {
    initializeTestButtons();
    updateTimeResult(0);
    resetTypingFeedback();
});

// ...existing code...

const typingFeedbackBox = document.createElement('div');
typingFeedbackBox.className = 'typing-feedback-box mb-3';
typingFeedbackBox.style.minHeight = '2em';
typingFeedbackBox.style.fontFamily = 'Nunito, sans-serif';
typingFeedbackBox.style.fontSize = '1.2rem';
typingFeedbackBox.style.marginBottom = '16px';

// Insert feedback box just before the textarea
typingInput.parentNode.insertBefore(typingFeedbackBox, typingInput);

function updateTypingFeedback() {
    const sample = getSampleText();
    const user = getUserInput();
    const sampleWords = sample.split(/\s+/);
    const userWords = user.split(/\s+/);

    let feedbackHTML = '';
    for (let i = 0; i < sampleWords.length; i++) {
        let colorClass = '';
        if (userWords[i] !== undefined && userWords[i].length > 0) {
            if (userWords[i] === sampleWords[i]) {
                colorClass = 'feedback-correct';
            } else {
                colorClass = 'feedback-incorrect';
            }
        }
        feedbackHTML += `<span class="${colorClass}">${sampleWords[i]}</span> `;
    }
    typingFeedbackBox.innerHTML = feedbackHTML.trim();
}

// Add feedback styles
const style = document.createElement('style');
style.textContent = `
.feedback-correct { color: #007bff; font-weight: bold; }
.feedback-incorrect { color: #dc3545; font-weight: bold; }
.typing-feedback-box { user-select: none; }
`;
document.head.appendChild(style);

// Listen for input events on the textarea
typingInput.addEventListener('input', updateTypingFeedback);

// Reset feedback on new test or retry
function resetTypingFeedback() {
    typingFeedbackBox.innerHTML = '';
}
retryButton.addEventListener('click', resetTypingFeedback);
select.addEventListener('change', resetTypingFeedback);

// Start test on first input
function handleTypingStart(e) {
    if (!testStarted && !timerRunning && typingInput.value.length === 1) {
        startTest();
    }
}

// Stop test on Enter key
typingInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && timerRunning) {
        e.preventDefault();
        stopTest();
    }
});

// Listen for typing to start the test
typingInput.addEventListener('input', handleTypingStart);

// Ensure initial state for new test
function initializeTestButtons() {
    testStarted = false;
    timerRunning = false;
    typingInput.value = '';
    typingInput.disabled = false;
}

window.addEventListener('DOMContentLoaded', initializeTestButtons);
retryButton.addEventListener('click', () => {
    initializeTestButtons();
    updateTimeResult(0);
    resetTypingFeedback();
});