const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const jumpButton = document.getElementById("jumpButton");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("score");

let isGameRunning = false;
let score = 0;
let cactusSpeed = 3000; // Kecepatan awal kaktus
let cactusInterval;

// Memulai permainan
startButton.addEventListener("click", function() {
    isGameRunning = true;
    score = 0; // Mulai dari skor 0
    cactusSpeed = 3000; // Reset kecepatan kaktus
    startButton.style.display = "none";
    cactus.style.display = "block";
    cactus.style.animation = `cactusMove ${cactusSpeed / 1000}s linear infinite`;
    updateScore();
    moveCactus();
});

// Tombol lompat
jumpButton.addEventListener("click", function() {
    jump();
});

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && isGameRunning) {
        jump();
    }
});

function jump() {
    if (!dino.classList.contains("jump")) {
        dino.classList.add("jump");
        
        setTimeout(function() {
            dino.classList.remove("jump");
        }, 500);
    }
}

// Menggerakkan kaktus dan meningkatkan kesulitan
function moveCactus() {
    cactus.style.animation = `cactusMove ${cactusSpeed / 1000}s linear infinite`;
    cactus.style.right = "-30px"; // Mulai dari luar layar

    cactusInterval = setInterval(() => {
        let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
        let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

        // Deteksi tabrakan
        if (cactusLeft < 20 && cactusLeft > 0 && dinoTop <= 0) {
            gameOver();
        } else if (cactusLeft < 0) {
            // Jika kaktus sudah melewati layar, tambahkan skor dan tingkatkan kesulitan
            score++;
            updateScore();

            if (score % 100 === 0) {
                increaseDifficulty();
            }
        }
    }, 10);
}

function increaseDifficulty() {
    cactusSpeed -= 25; // Percepat kaktus setiap 100 poin
    cactus.style.animationDuration = `${cactusSpeed / 1000}s`;
}

function updateScore() {
    scoreDisplay.innerText = `Score: ${score}`;
}

function gameOver() {
    isGameRunning = false;
    clearInterval(cactusInterval);
    cactus.style.animation = "none";
    cactus.style.display = "none";
    alert("Game Over! Skor kamu: " + score);
    startButton.style.display = "block";
}

let highScores = JSON.parse(localStorage.getItem("highScores")) || [0, 0, 0]; // Skor tertinggi
const leaderboardList = document.getElementById("leaderboardList");

function updateLeaderboard() {
    highScores.push(score); // Tambahkan skor baru
    highScores.sort((a, b) => b - a); // Urutkan dari tinggi ke rendah
    highScores = highScores.slice(0, 3); // Ambil 3 skor tertinggi
    localStorage.setItem("highScores", JSON.stringify(highScores)); // Simpan ke localStorage

    // Perbarui tampilan leaderboard
    leaderboardList.innerHTML = "";
    highScores.forEach((highScore, index) => {
        leaderboardList.innerHTML += `<li>${index + 1}. Player - Score: ${highScore}</li>`;
    });
}

// Panggil updateLeaderboard dalam fungsi gameOver
function gameOver() {
    isGameRunning = false;
    clearInterval(cactusInterval);
    cactus.style.animation = "none";
    cactus.style.display = "none";
    alert("Game Over! Skor kamu: " + score);
    updateLeaderboard(); // Perbarui leaderboard saat game over
    startButton.style.display = "block";
}