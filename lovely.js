
const sounds = {
    ocean: new Audio("sounds/ocean.mp3"),
    click: new Audio("sounds/click.mp3"),
    correct: new Audio("sounds/correct.mp3"),
    wrong: new Audio("sounds/wrong.mp3"),
    victory: new Audio("sounds/victory.mp3")
};

sounds.ocean.loop = true;
sounds.ocean.volume = 1;

sounds.click.volume = 0.4;
sounds.correct.volume = 0.5;
sounds.wrong.volume = 0.5;
sounds.victory.volume = 0.6;

let soundEnabled = true;

function playSound(name) {
    if (!soundEnabled) return;

    // Restart short effects if they are played again.
    sounds[name].currentTime = 0;
    sounds[name].play().catch(() => {
        console.log("Could not play sound:", name);
    });
}

const soundButton = document.getElementById("sound-button");

soundButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;

    soundButton.textContent = soundEnabled
        ? "🔊 Sound On"
        : "🔇 Sound Off";

    if (soundEnabled) {
        if (currentChallenge >= challenges.length) {
            playSound("victory");
        } else if (currentChallenge > 0 || !startButton.classList.contains("hidden")) {
            playSound("click");
        }

        if (!startButton.classList.contains("hidden")) {
            // Keep ambience off until the adventure starts.
            sounds.ocean.pause();
        } else {
            sounds.ocean.play().catch(() => { });
        }
    } else {
        sounds.ocean.pause();
        sounds.ocean.currentTime = 0;
    }
});



const challenges = [
    {
        question: "Challenge 1 : Flying Dutchman, what is the correct code required to unlock the captain's safe?",
        answers: ["15093", "12450", "19821"],
        correct: 0,
        success: "The chest is open ! You found the captain's map."
    },

    {
        question: "Challenge 2 :  What can you follow but never catch ?",
        answers: ["A treasure chest", "A shadow", "A ship"],
        correct: 1,
        success: "Correct! The shadow leads you to the next clue . "
    },

    {
        question: "The last Challenge : Which place hides the treasure?",
        answers: ["on the moon", "on the island", "under the sea"],
        correct: 2,
        success: "You found the treasure and broke the curse !"
    }
];

const startButton = document.getElementById("start-button");
const question = document.getElementById("question");
const answers = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const story = document.getElementById("story");

let currentChallenge = 0;

function startGame() {
    codeGame.classList.add("hidden");
    secondGameButton.classList.add("hidden");

    secretCode.disabled = false;
    checkCodeButton.disabled = false;
    codeFeedback.textContent = "";
    sounds.ocean.currentTime = 0;

    if (soundEnabled) {
        sounds.ocean.play().catch(() => { });
        playSound("click");
    }
    currentChallenge = 0;
    startButton.classList.add("hidden");
    story.textContent = "Choose carefully, sailor. The ship is watching you...";
    showChallenge();

    document.getElementById("treasure-reveal")
        .classList.add("hidden");

    document.getElementById("treasure-chest")
        .classList.remove("opening");
}


function showChallenge() {
    const challenge = challenges[currentChallenge];

    question.textContent = challenge.question;
    feedback.textContent = "";
    answers.innerHTML = "";

    // Animate the question every time a challenge appears
    question.classList.remove("challenge-animate");
    void question.offsetWidth;
    question.classList.add("challenge-animate");

    challenge.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.textContent = answer;

        button.addEventListener("click", () => {
            checkAnswer(index);
        });

        answers.appendChild(button);
    });
}


function checkAnswer(selectedIndex) {
    const challenge = challenges[currentChallenge];

    if (selectedIndex === challenge.correct) {
        playSound("correct");
        feedback.textContent = challenge.success;
        currentChallenge++;

        if (currentChallenge === challenges.length) {
            sounds.ocean.pause();
            playSound("victory");
            question.textContent = "🏆 CURSE BROKEN!";
            story.textContent =
                "Congratulations, brave sailor! You escaped the Flying Dutchman!";
            answers.innerHTML = "";
            startButton.textContent = "Play Again";
            startButton.classList.remove("hidden");
            secondGameButton.classList.remove("hidden");
        } else {
            const nextButton = document.createElement("button");
            nextButton.textContent = "Next Challenge";
            nextButton.addEventListener("click", showChallenge);
            answers.innerHTML = "";
            answers.appendChild(nextButton);
        }
    } else {
        playSound("wrong");
        feedback.textContent =
            "Wrong answer! The curse remains. Try again, sailor!";
    }
}

startButton.addEventListener("click", startGame);




const secondGameButton = document.getElementById("second-game-button");
const codeGame = document.getElementById("code-game");
const secretCode = document.getElementById("secret-code");
const checkCodeButton = document.getElementById("check-code-button");
const codeFeedback = document.getElementById("code-feedback");

// Open mini-game 2 after the first game is completed.
secondGameButton.addEventListener("click", () => {
    playSound("click");

    codeGame.classList.remove("hidden");
    codeGame.classList.remove("challenge-animate");

    // Restart the entrance animation.
    void codeGame.offsetWidth;
    codeGame.classList.add("challenge-animate");

    secondGameButton.classList.add("hidden");
    secretCode.value = "";
    codeFeedback.textContent = "";

    secretCode.focus();
});

// Check the player's secret code.
function checkCaptainCode() {
    const enteredCode = secretCode.value.trim();

    if (!/^\d{3}$/.test(enteredCode)) {
        codeFeedback.textContent =
            "Enter exactly three digits, sailor!";
        playSound("wrong");
        return;
    }


    if (enteredCode === "369") {
        codeFeedback.textContent =
            "🔓 The lock clicks open...";

        checkCodeButton.disabled = true;
        secretCode.disabled = true;

        sounds.ocean.pause();
        playSound("victory");

        const treasureReveal =
            document.getElementById("treasure-reveal");
        const treasureChest =
            document.getElementById("treasure-chest");

        treasureReveal.classList.remove("hidden");
        treasureChest.classList.remove("opening");

        // Restart the chest animation.
        void treasureChest.offsetWidth;
        treasureChest.classList.add("opening");
    }
    else {
        codeFeedback.textContent =
            "❌ Incorrect code! The curse remains. Try again!";
        playSound("wrong");
    }
}

checkCodeButton.addEventListener("click", checkCaptainCode);

// Let players press Enter instead of clicking Unlock Chest.
secretCode.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkCaptainCode();
    }
});
