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

select.addEventListener('change', setRandomText);
