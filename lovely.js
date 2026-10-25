
/* ========================================
   ESCAPE THE FLYING DUTCHMAN
======================================== */

const $ = (id) => document.getElementById(id);

// Screens
const screens = [
    $("intro-screen"),
    $("map-screen"),
    $("quiz-screen"),
    $("code-screen"),
    $("emoji-screen"),
    $("victory-screen")
];

function showScreen(screen) {
    screens.forEach((item) => item.classList.add("hidden"));
    screen.classList.remove("hidden");
}

// Buttons
const startButton = $("start-button");
const mission1 = $("mission-1");
const mission2 = $("mission-2");
const mission3 = $("mission-3");

const quizNext = $("quiz-next");
const checkCodeButton = $("check-code-button");
const hiddenEmoji = $("hidden-emoji");
const playAgainButton = $("play-again-button");
const soundButton = $("sound-button");

// Progress
let quizIndex = 0;
let score = 0;
let quizAnswered = false;
let timerInterval = null;
let timeLeft = 60;
let soundOn = true;

// Sounds — use your existing sound files
const sounds = {
    ocean: new Audio("sounds/ocean.mp3"),
    click: new Audio("sounds/click.mp3"),
    correct: new Audio("sounds/correct.mp3"),
    wrong: new Audio("sounds/wrong.mp3"),
    victory: new Audio("sounds/victory.mp3")
};

sounds.ocean.loop = true;
sounds.ocean.volume = 0.25;

function playSound(name) {
    if (!soundOn || !sounds[name]) return;

    sounds[name].currentTime = 0;
    sounds[name].play().catch(() => { });
}

function startOcean() {
    if (soundOn) {
        sounds.ocean.play().catch(() => { });
    }
}

function stopTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// ========================================
// CHALLENGE 1: GENERAL KNOWLEDGE QUIZ
// ========================================

const questions = [
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Venus", "Mars", "Jupiter", "Mercury"],
        correct: 1
    },
    {
        question: "How many days are there in a leap year?",
        answers: ["364", "365", "366", "367"],
        correct: 2
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: 3
    },
    {
        question: "Which gas do plants absorb from the atmosphere?",
        answers: ["Oxygen", "Carbon dioxide", "Hydrogen", "Helium"],
        correct: 1
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: ["Ag", "Gd", "Au", "Go"],
        correct: 2
    }
];

function startQuiz() {
    quizIndex = 0;
    score = 0;

    $("quiz-score").textContent = "";
    $("feedback").textContent = "";
    quizNext.classList.add("hidden");

    showScreen($("quiz-screen"));
    showQuestion();
    playSound("click");
}

function showQuestion() {
    quizAnswered = false;

    const current = questions[quizIndex];

    $("quiz-progress").textContent =
        `Question ${quizIndex + 1} of ${questions.length}`;

    $("question").textContent = current.question;
    $("feedback").textContent = "";
    $("quiz-score").textContent = `Score: ${score}`;

    const answersArea = $("answers");
    answersArea.replaceChildren();

    current.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = answer;

        button.addEventListener("click", () => {
            checkAnswer(index, button);
        });

        answersArea.appendChild(button);
    });
}

function checkAnswer(selectedIndex, selectedButton) {
    if (quizAnswered) return;

    quizAnswered = true;

    const current = questions[quizIndex];
    const answerButtons = $("answers").querySelectorAll("button");

    answerButtons.forEach((button) => {
        button.disabled = true;
    });

    if (selectedIndex === current.correct) {
        score++;
        $("feedback").textContent = "Correct! Well done, sailor! ⚓";
        playSound("correct");
    } else {
        $("feedback").textContent =
            `Not quite! The correct answer is: ${current.answers[current.correct]}.`;
        playSound("wrong");
    }

    selectedButton.setAttribute(
        "aria-pressed",
        String(selectedIndex === current.correct)
    );

    $("quiz-score").textContent = `Score: ${score} / 5`;

    quizNext.textContent =
        quizIndex === questions.length - 1
            ? "See My Result"
            : "Next Question";

    quizNext.classList.remove("hidden");
}

quizNext.addEventListener("click", () => {
    if (!quizAnswered) return;

    if (quizIndex < questions.length - 1) {
        quizIndex++;
        showQuestion();
    } else {
        finishQuiz();
    }
});

function finishQuiz() {
    $("answers").replaceChildren();
    quizNext.classList.add("hidden");

    $("quiz-progress").textContent = "Quiz completed!";
    $("question").textContent = `You scored ${score} out of 5.`;

    if (score >= 3) {
        $("feedback").textContent =
            "You passed! Challenge 2 is now unlocked! 🔓";

        mission2.disabled = false;
        mission2.classList.remove("locked");
        mission2.querySelector(".mission-status").textContent =
            "🔓 Unlocked";

        const continueButton = document.createElement("button");
        continueButton.textContent = "Return to Challenges";
        continueButton.addEventListener("click", () => {
            showScreen($("map-screen"));
            playSound("click");
        });

        $("answers").appendChild(continueButton);
    } else {
        $("feedback").textContent =
            "Not enough points yet! Try the quiz again from the beginning.";

        const retryButton = document.createElement("button");
        retryButton.textContent = "Try Again";
        retryButton.addEventListener("click", startQuiz);

        $("answers").appendChild(retryButton);
    }

    $("quiz-score").textContent = `Final score: ${score} / 5`;
}

// ========================================
// CHALLENGE 2: SECRET CODE
// ========================================

function checkCode() {
    const enteredCode = $("secret-code").value.trim();

    if (enteredCode === "531") {
        $("code-feedback").textContent =
            "The chest opens! Challenge 3 is unlocked! 🗝️";

        playSound("correct");

        mission3.disabled = false;
        mission3.classList.remove("locked");
        mission3.querySelector(".mission-status").textContent =
            "🔓 Unlocked";

        $("secret-code").value = "";

        setTimeout(() => {
            showScreen($("map-screen"));
        }, 1200);
    } else {
        $("code-feedback").textContent =
            "Wrong code! Read the three clues carefully and try again.";

        playSound("wrong");
    }
}

checkCodeButton.addEventListener("click", checkCode);

$("secret-code").addEventListener("keydown", (event) => {
    if (event.key === "Enter") checkCode();
});

// ========================================
// CHALLENGE 3: FIND THE HIDDEN EMOJI
// ========================================

function startEmojiChallenge() {
    stopTimer();

    const name = $("player-name").value.trim();

    if (!name) {
        $("emoji-feedback").textContent =
            "Please enter your name before starting!";
        $("player-name").focus();
        return;
    }

    timeLeft = 60;
    $("timer").textContent = timeLeft;
    $("emoji-feedback").textContent = "The hunt begins! Find the skull!";
    hiddenEmoji.disabled = false;
    hiddenEmoji.classList.remove("hidden");

    showScreen($("emoji-screen"));

    // Hide the emoji until the player starts searching.
    // Its location remains clickable.
    hiddenEmoji.style.opacity = "0.08";

    playSound("click");

    timerInterval = setInterval(() => {
        timeLeft--;
        $("timer").textContent = timeLeft;

        if (timeLeft <= 0) {
            stopTimer();
            hiddenEmoji.disabled = true;
            $("emoji-feedback").textContent =
                "Time's up! Return to the challenges and try again.";
            hiddenEmoji.classList.add("hidden");
            playSound("wrong");
        }
    }, 1000);
}

hiddenEmoji.addEventListener("click", () => {
    if (timeLeft <= 0 || hiddenEmoji.disabled) return;

    stopTimer();
    hiddenEmoji.disabled = true;

    const name = $("player-name").value.trim() || "Brave sailor";

    $("victory-message").textContent =
        `Congratulations, sailor ${name}! You escaped the Flying Dutchman!`;

    showScreen($("victory-screen"));
    playSound("victory");
});

function openEmojiChallenge() {
    $("emoji-feedback").textContent = "";
    showScreen($("emoji-screen"));

    // The player must enter a name before the countdown begins.
    stopTimer();
    $("timer").textContent = "60";
    hiddenEmoji.disabled = true;
    hiddenEmoji.classList.remove("hidden");
    hiddenEmoji.style.opacity = "0.08";

    $("player-name").focus();
}

// Add a Start Hunt button so the player can enter their name first.
const huntButton = document.createElement("button");
huntButton.type = "button";
huntButton.textContent = "Start the Hunt";
huntButton.addEventListener("click", startEmojiChallenge);

$("emoji-screen").insertBefore(
    huntButton,
    $("emoji-feedback")
);

// ========================================
// NAVIGATION
// ========================================

startButton.addEventListener("click", () => {
    startOcean();
    showScreen($("map-screen"));
    playSound("click");
});

mission1.addEventListener("click", startQuiz);

mission2.addEventListener("click", () => {
    if (mission2.disabled) return;

    $("code-feedback").textContent = "";
    showScreen($("code-screen"));
    playSound("click");
});

mission3.addEventListener("click", () => {
    if (mission3.disabled) return;

    openEmojiChallenge();
    playSound("click");
});

document.querySelectorAll(".back-button").forEach((button) => {
    button.addEventListener("click", () => {
        stopTimer();
        showScreen($("map-screen"));
        playSound("click");
    });
});

soundButton.addEventListener("click", () => {
    soundOn = !soundOn;

    soundButton.textContent = soundOn
        ? "🔊 Sound On"
        : "🔇 Sound Off";

    if (soundOn) {
        startOcean();
    } else {
        sounds.ocean.pause();
    }
});

playAgainButton.addEventListener("click", () => {
    stopTimer();

    // Reset challenge unlocks
    mission2.disabled = true;
    mission2.classList.add("locked");
    mission2.querySelector(".mission-status").textContent = "Locked";

    mission3.disabled = true;
    mission3.classList.add("locked");
    mission3.querySelector(".mission-status").textContent = "Locked";

    $("player-name").value = "";
    $("secret-code").value = "";
    $("code-feedback").textContent = "";
    $("emoji-feedback").textContent = "";

    showScreen($("intro-screen"));
    playSound("click");
});

// Start at the intro screen
showScreen($("intro-screen"));



const helpButton = document.getElementById("help-button");
const helpPanel = document.getElementById("help-panel");
const closeHelp = document.getElementById("close-help");

helpButton.addEventListener("click", () => {
    helpPanel.classList.toggle("hidden");
});

closeHelp.addEventListener("click", () => {
    helpPanel.classList.add("hidden");
});
