document.addEventListener('DOMContentLoaded', () => {
    // Phases
    const phase1 = document.getElementById('phase-1');
    const phase2 = document.getElementById('phase-2');
    const phase3 = document.getElementById('phase-3');
    const phase4 = document.getElementById('phase-4');

    // Verification
    const nameInput = document.getElementById('name-input');
    const verifyBtn = document.getElementById('verify-btn');
    const errorMsg = document.getElementById('error-msg');

    // Balloon Game
    const popCountDisplay = document.getElementById('pop-count');
    const timeLeftDisplay = document.getElementById('time-left');
    const balloonContainer = document.getElementById('balloon-container');
    const retryBtn = document.getElementById('retry-btn');
    const totalBalloons = 27;
    let poppedCount = 0;
    let balloonInterval;
    let gameTimer;
    let timeLeft = 30;
    let gameActive = false;

    // Gallery
    const galleryGrid = document.getElementById('gallery-grid');
    const nextToFinalBtn = document.getElementById('next-to-final-btn');

    // Using the local media files directly
    const mediaFiles = [
        { type: 'image', src: 'WhatsApp Image 2026-06-03 at 7.34.55 AM.jpeg' },
        { type: 'video', src: 'WhatsApp Video 2026-06-03 at 7.34.56 AM.mp4' },
        { type: 'video', src: 'WhatsApp Video 2026-06-03 at 7.34.57 AM.mp4' },
        { type: 'video', src: 'WhatsApp Video 2026-06-03 at 7.35.01 AM.mp4' },
        { type: 'video', src: 'WhatsApp Video 2026-06-03 at 7.35.06 AM.mp4' },
        { type: 'video', src: 'WhatsApp Video 2026-06-03 at 7.38.27 AM.mp4' }
    ];

    // Replay
    const replayBtn = document.getElementById('replay-btn');

    // Transition Helper
    function switchPhase(from, to) {
        from.classList.remove('active');
        setTimeout(() => {
            from.classList.add('hidden');
            to.classList.remove('hidden');
            // Slight delay before adding active to trigger CSS transition
            setTimeout(() => {
                to.classList.add('active');
            }, 50);
        }, 800); // Wait for fade out
    }

    // Phase 1: Verify
    function verifyName() {
        const name = nameInput.value.trim().toLowerCase();
        // Allow slightly misspelled names or extra spaces
        if (name.includes('belinda')) {
            switchPhase(phase1, phase2);
            setTimeout(startBalloonGame, 1000);
        } else {
            errorMsg.classList.remove('hidden');
            setTimeout(() => {
                errorMsg.classList.add('hidden');
            }, 3000);
        }
    }

    verifyBtn.addEventListener('click', verifyName);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyName();
    });

    // Phase 2: Balloons
    const colors = ['#ff758c', '#ff7eb3', '#a1c4fd', '#c2e9fb', '#fbc2eb', '#a6c1ee', '#fbc2eb'];
    let spawnedBalloons = 0;

    function createBalloon() {
        if (!gameActive) return;

        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        
        // Random horizontal position
        const leftPos = Math.random() * 80 + 10; // 10% to 90%
        balloon.style.left = `${leftPos}%`;
        
        // Random color
        const color = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.backgroundColor = color;
        balloon.style.color = color; // For the tail
        
        // Random animation duration
        const duration = Math.random() * 3 + 5; // 5 to 8 seconds
        balloon.style.animationDuration = `${duration}s`;

        // Interaction
        balloon.addEventListener('click', function() {
            popBalloon(this);
        });

        // Touch support
        balloon.addEventListener('touchstart', function(e) {
            e.preventDefault();
            popBalloon(this);
        });

        balloonContainer.appendChild(balloon);
        spawnedBalloons++;

        // Remove if it floats away and spawn another one to make sure 27 are popped
        setTimeout(() => {
            if (balloonContainer.contains(balloon)) {
                balloonContainer.removeChild(balloon);
                spawnedBalloons--; // Decrease so another can spawn
            }
        }, duration * 1000);
    }

    function popBalloon(balloon) {
        if(!gameActive || !balloonContainer.contains(balloon)) return;
        
        // Visual Pop effect
        balloon.style.transform = 'scale(0)';
        balloon.style.opacity = '0';
        
        // Optional sound effect could go here
        
        setTimeout(() => {
            if(balloonContainer.contains(balloon)) {
                balloonContainer.removeChild(balloon);
            }
        }, 150);

        poppedCount++;
        popCountDisplay.innerText = poppedCount;

        if (poppedCount >= totalBalloons) {
            endGame(true);
        }
    }

    function endGame(success) {
        gameActive = false;
        clearInterval(balloonInterval);
        clearInterval(gameTimer);

        if (success) {
            setTimeout(() => {
                switchPhase(phase2, phase3);
                buildGallery();
            }, 1000);
        } else {
            // Show retry button
            retryBtn.classList.remove('hidden');
        }
    }

    retryBtn.addEventListener('click', startBalloonGame);

    function startBalloonGame() {
        poppedCount = 0;
        timeLeft = 30;
        gameActive = true;
        retryBtn.classList.add('hidden');
        popCountDisplay.innerText = poppedCount;
        timeLeftDisplay.innerText = timeLeft;
        balloonContainer.innerHTML = '';
        
        // Spawn a balloon every 600ms
        balloonInterval = setInterval(createBalloon, 600);
        
        gameTimer = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.innerText = timeLeft;
            if (timeLeft <= 0) {
                endGame(false);
            }
        }, 1000);
    }

    // Phase 3: Gallery
    function buildGallery() {
        galleryGrid.innerHTML = '';
        mediaFiles.forEach(media => {
            let el;
            if (media.type === 'image') {
                el = document.createElement('img');
                el.src = media.src;
                el.alt = 'Memory';
            } else if (media.type === 'video') {
                el = document.createElement('video');
                el.src = media.src;
                el.controls = true;
                el.preload = 'metadata';
            }
            el.classList.add('media-item');
            galleryGrid.appendChild(el);
        });

        // Show the next button after a short delay so they can look at photos
        setTimeout(() => {
            nextToFinalBtn.classList.remove('hidden');
        }, 3000);
    }

    nextToFinalBtn.addEventListener('click', () => {
        // Pause all videos
        document.querySelectorAll('video').forEach(vid => vid.pause());
        switchPhase(phase3, phase4);
        fireConfetti();
    });

    // Phase 4: Confetti
    function fireConfetti() {
        var duration = 5 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, { particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    }

    replayBtn.addEventListener('click', () => {
        // Go back to gallery
        switchPhase(phase4, phase3);
    });
});
