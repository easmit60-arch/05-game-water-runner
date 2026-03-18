// Beginner-friendly DOM version of Water Runner logic.
// Note: With current defaults, balance can be harder than a 23% target win rate.
// This file is aligned to the same key game checkpoints used in index.html:
// 1) Build the dam to start flourish mode.
// 2) Survive a 30-second flourish window.
// 3) Keep score under the flood limit (135).
// 4) Reach max stored water at least once, then win check can pass.

// -----------------------------
// Core rules (easy to tweak)
// -----------------------------
const DAM_UNLOCK_SCORE = 25;
const DAM_MIN_STORED_WATER = 25;
const FLOURISH_SECONDS = 30;
const FLOOD_SCORE_LIMIT = 135;
const WATER_STORAGE_MAX = 100;
const DRAIN_PER_SECOND = 5;
const SPAWN_INTERVAL_MS = 1000;

// -----------------------------
// UI elements (with safe fallbacks)
// -----------------------------
const gridEl = document.querySelector('.game-grid');
const startButton = document.getElementById('start-game') || document.getElementById('startBtn');
const buildDamButton = document.getElementById('build-dam') || document.getElementById('buildDam');
const scoreEl = document.getElementById('score');
const storedWaterEl = document.getElementById('storedWater');
const timerEl = document.getElementById('timer');
const statusEl = document.getElementById('status');
const existingPlayAgainButton = document.getElementById('playAgainBtn');

// -----------------------------
// Game state (single source of truth)
// -----------------------------
const game = {
  state: 'start', // start | playing | won | lost
  score: 0,
  storedWater: 0,
  reachedMaxStorage: false,
  damBuilt: false,
  flourishStartMs: 0,
  confettiIntervalId: null,
  confettiContainer: null,
  spawnIntervalId: null,
  tickIntervalId: null
};

// Inject tiny CSS from JavaScript so this file can run without editing style.css.
function injectUiStyles() {
  const styleId = 'water-runner-script-styles';
  if (document.getElementById(styleId)) {
    return;
  }

  const styleEl = document.createElement('style');
  styleEl.id = styleId;
  styleEl.textContent = `
    .script-play-again {
      margin-top: 10px;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid #2b5f86;
      background: #0d3b66;
      color: #ffffff;
      cursor: pointer;
      font-weight: 700;
    }

    .script-hidden {
      display: none !important;
    }

    .script-confetti-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 9999;
    }

    .script-confetti-piece {
      position: absolute;
      top: -20px;
      font-size: 18px;
      animation: scriptConfettiFall linear forwards;
    }

    @keyframes scriptConfettiFall {
      to {
        transform: translateY(110vh) rotate(420deg);
        opacity: 0.95;
      }
    }
  `;
  document.head.appendChild(styleEl);
}

// Use the real Play Again button when it exists.
// If it does not exist, create a fallback button for this DOM script.
function getPlayAgainButton() {
  if (existingPlayAgainButton) {
    return existingPlayAgainButton;
  }

  let fallbackButton = document.getElementById('scriptPlayAgainBtn');
  if (fallbackButton) {
    return fallbackButton;
  }

  fallbackButton = document.createElement('button');
  fallbackButton.id = 'scriptPlayAgainBtn';
  fallbackButton.type = 'button';
  fallbackButton.className = 'script-play-again script-hidden';
  fallbackButton.textContent = 'Play Again';

  // Place button near status if possible; otherwise append to body.
  if (statusEl && statusEl.parentElement) {
    statusEl.parentElement.appendChild(fallbackButton);
  } else {
    document.body.appendChild(fallbackButton);
  }

  return fallbackButton;
}

const playAgainButton = getPlayAgainButton();

function showPlayAgain() {
  if (!playAgainButton) {
    return;
  }

  playAgainButton.classList.remove('script-hidden');
  playAgainButton.classList.remove('hidden');
}

function hidePlayAgain() {
  if (!playAgainButton) {
    return;
  }

  playAgainButton.classList.add('script-hidden');
}

// Paint the page to communicate village state to beginners.
function updateVillageBackground() {
  if (!document.body) {
    return;
  }

  if (game.state === 'won') {
    document.body.style.background = 'linear-gradient(180deg, #d7f7df 0%, #9ee39c 100%)';
    return;
  }

  if (game.state === 'lost') {
    document.body.style.background = 'linear-gradient(180deg, #9ec8ef 0%, #4a89c9 100%)';
    return;
  }

  if (game.state === 'playing' && game.damBuilt) {
    // Village is flourishing in the background once dam is built.
    document.body.style.background = 'linear-gradient(180deg, #edf9ee 0%, #b7e8b2 100%)';
    return;
  }

  // Dry village default background.
  document.body.style.background = 'linear-gradient(180deg, #f3efe3 0%, #d7c59d 100%)';
}

function clearConfetti() {
  if (game.confettiIntervalId) {
    clearInterval(game.confettiIntervalId);
    game.confettiIntervalId = null;
  }

  if (game.confettiContainer && game.confettiContainer.parentElement) {
    game.confettiContainer.parentElement.removeChild(game.confettiContainer);
  }

  game.confettiContainer = null;
}

function launchConfetti() {
  clearConfetti();

  const layer = document.createElement('div');
  layer.className = 'script-confetti-layer';
  document.body.appendChild(layer);
  game.confettiContainer = layer;

  const pieces = ['🎉', '✨', '🎊'];
  let created = 0;
  const maxPieces = 90;

  game.confettiIntervalId = setInterval(() => {
    for (let count = 0; count < 6; count += 1) {
      if (created >= maxPieces) {
        clearInterval(game.confettiIntervalId);
        game.confettiIntervalId = null;
        return;
      }

      const piece = document.createElement('span');
      piece.className = 'script-confetti-piece';
      piece.textContent = pieces[Math.floor(Math.random() * pieces.length)];
      piece.style.left = `${Math.floor(Math.random() * 100)}%`;
      piece.style.animationDuration = `${2 + Math.random() * 2}s`;
      layer.appendChild(piece);

      setTimeout(() => {
        if (piece.parentElement) {
          piece.parentElement.removeChild(piece);
        }
      }, 4500);

      created += 1;
    }
  }, 120);
}

// Creates a simple 3x3 DOM grid.
function createGrid() {
  if (!gridEl) {
    return;
  }

  gridEl.innerHTML = '';
  for (let index = 0; index < 9; index += 1) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    gridEl.appendChild(cell);
  }
}

// Updates all on-screen text so students can debug state changes easily.
function updateHud(nowMs = Date.now()) {
  if (scoreEl) {
    scoreEl.textContent = `Score: ${game.score} / ${FLOOD_SCORE_LIMIT}`;
  }

  if (storedWaterEl) {
    storedWaterEl.textContent = `Stored: ${game.storedWater}/${WATER_STORAGE_MAX}`;
  }

  if (timerEl) {
    // The timer is only active after the dam is built.
    if (game.state !== 'playing') {
      timerEl.textContent = 'Flourish: --';
    } else if (!game.damBuilt) {
      timerEl.textContent = 'Flourish: Build Dam';
    } else {
      const elapsedSeconds = Math.floor((nowMs - game.flourishStartMs) / 1000);
      const secondsLeft = Math.max(0, FLOURISH_SECONDS - elapsedSeconds);
      timerEl.textContent = `Flourish: ${secondsLeft}s`;
    }
  }

  if (buildDamButton) {
    const canBuildDam = game.state === 'playing' && !game.damBuilt && game.score >= DAM_UNLOCK_SCORE && game.storedWater >= DAM_MIN_STORED_WATER;

    buildDamButton.disabled = !canBuildDam;
    buildDamButton.textContent = game.damBuilt ? 'Dam Built ✓' : 'Build Dam';
  }
}

function setStatus(message) {
  if (statusEl) {
    statusEl.textContent = message;
  }
}

// Places one clickable water can into a random grid cell.
function spawnWaterCan() {
  if (!gridEl || game.state !== 'playing') {
    return;
  }

  const cells = gridEl.querySelectorAll('.grid-cell');
  if (cells.length === 0) {
    return;
  }

  cells.forEach((cell) => {
    cell.innerHTML = '';
  });

  const randomIndex = Math.floor(Math.random() * cells.length);
  const randomCell = cells[randomIndex];

  randomCell.innerHTML = `
    <button class="water-can" type="button" aria-label="Collect water">
      💧
    </button>
  `;

  const canButton = randomCell.querySelector('.water-can');
  if (canButton) {
    canButton.addEventListener('click', collectWaterCan, { once: true });
  }
}

// This matches the collection behavior in index.html:
// +1 score and +1 stored water (capped at max).
function collectWaterCan() {
  if (game.state !== 'playing') {
    return;
  }

  game.score += 1;
  game.storedWater = Math.min(WATER_STORAGE_MAX, game.storedWater + 1);

  if (game.storedWater >= WATER_STORAGE_MAX) {
    game.reachedMaxStorage = true;
  }

  updateHud();
  checkLoss();
  checkWin();
}

// This matches buildDam flow in index.html:
// - requires playing state
// - requires unlocked score and enough stored water
// - sets dam state and starts flourish timer
function buildDam() {
  if (game.state !== 'playing' || game.damBuilt) {
    return;
  }

  if (game.score < DAM_UNLOCK_SCORE) {
    setStatus(`Dam unlocks at score ${DAM_UNLOCK_SCORE}.`);
    return;
  }

  if (game.storedWater < DAM_MIN_STORED_WATER) {
    setStatus(`Store at least ${DAM_MIN_STORED_WATER} water before building the dam.`);
    return;
  }

  game.damBuilt = true;
  game.flourishStartMs = Date.now();

  setStatus(`Dam built! Keep score under ${FLOOD_SCORE_LIMIT} for ${FLOURISH_SECONDS}s and reach ${WATER_STORAGE_MAX} stored water.`);
  updateVillageBackground();
  updateHud();
}

// This matches flood loss logic in index.html: lose if score goes above 135.
function checkLoss() {
  if (game.state !== 'playing') {
    return;
  }

  if (game.score > FLOOD_SCORE_LIMIT) {
    game.state = 'lost';
    stopLoops();
    setStatus(`Flooded village. You lost because score went above ${FLOOD_SCORE_LIMIT}.`);
    updateVillageBackground();
    showPlayAgain();
    updateHud();
  }
}

// This matches flourish win logic in index.html:
// win when all conditions are true together.
function checkWin(nowMs = Date.now()) {
  if (game.state !== 'playing' || !game.damBuilt) {
    return;
  }

  const elapsedSeconds = (nowMs - game.flourishStartMs) / 1000;
  const flourishDone = elapsedSeconds >= FLOURISH_SECONDS;
  const scoreSafe = game.score < FLOOD_SCORE_LIMIT;
  const storageGoalMet = game.reachedMaxStorage;

  if (flourishDone && scoreSafe && storageGoalMet) {
    game.state = 'won';
    stopLoops();
    setStatus('🎉 Congratulations! The village is flourishing. You won by keeping score under 135 for 30 seconds and reaching 100 stored water.');
    updateVillageBackground();
    launchConfetti();
    showPlayAgain();
    updateHud(nowMs);
  }
}

// Runs every second while playing.
// After the dam is built, stored water drains by 5 each second (like index.html).
function gameTick() {
  if (game.state !== 'playing') {
    return;
  }

  if (game.damBuilt) {
    game.storedWater = Math.max(0, game.storedWater - DRAIN_PER_SECOND);
  }

  updateHud();
  checkLoss();
  checkWin();
}

function stopLoops() {
  if (game.spawnIntervalId) {
    clearInterval(game.spawnIntervalId);
    game.spawnIntervalId = null;
  }

  if (game.tickIntervalId) {
    clearInterval(game.tickIntervalId);
    game.tickIntervalId = null;
  }
}

// Resets all state values for a new run.
function resetGame() {
  stopLoops();
  clearConfetti();

  game.state = 'start';
  game.score = 0;
  game.storedWater = 0;
  game.reachedMaxStorage = false;
  game.damBuilt = false;
  game.flourishStartMs = 0;

  createGrid();
  hidePlayAgain();
  updateVillageBackground();
  updateHud();
  setStatus('Press Start to begin.');
}

function startGame() {
  // Prevent duplicate loops if the game is already running.
  if (game.state === 'playing') {
    return;
  }

  game.state = 'playing';
  game.score = 0;
  game.storedWater = 0;
  game.reachedMaxStorage = false;
  game.damBuilt = false;
  game.flourishStartMs = 0;

  createGrid();
  hidePlayAgain();
  updateVillageBackground();
  updateHud();
  setStatus('Collect drops, build dam, survive 30s, stay under 135, and max out storage.');

  game.spawnIntervalId = setInterval(spawnWaterCan, SPAWN_INTERVAL_MS);
  game.tickIntervalId = setInterval(gameTick, 1000);
  spawnWaterCan();
}

// -----------------------------
// Event wiring
// -----------------------------
if (startButton) {
  startButton.addEventListener('click', startGame);
}

if (buildDamButton) {
  buildDamButton.addEventListener('click', buildDam);
}

if (playAgainButton) {
  playAgainButton.addEventListener('click', startGame);
}

// Run setup once.
injectUiStyles();
resetGame();
 
function runTrial({ maxSeconds = 80, damAtStored = 95, postDamRainIntensity = null, drainAmountPerTick = null } = {}) {
   const env = makeEnv();
   const s = env.api;
   s.startGame();

  if (postDamRainIntensity !== null) {
    s.game.postDamRainIntensity = postDamRainIntensity;
  }

  if (drainAmountPerTick !== null) {
    s.game.drainAmountPerTick = drainAmountPerTick;
  }
 
   const fps = 60;
   const maxFrames = Math.floor(maxSeconds * fps);
 
   for (let frame = 1; frame <= maxFrames; frame += 1) {
     env.setNow(frame * (1000 / fps));
     const g = s.game;
 
     if (g.state !== 'playing') {
       break;
     }
 
     g.keys.left = false;
     g.keys.right = false;
     g.keys.up = false;
     g.keys.down = false;
 
     const target = chooseTarget(g);
     if (target) {
       if (target.x < g.river.x - 2) {
         g.keys.left = true;
       } else if (target.x > g.river.x + 2) {
         g.keys.right = true;
       }
 
       if (target.y < g.river.y - 3) {
         g.keys.up = true;
       } else if (target.y > g.river.y + 3) {
         g.keys.down = true;
       }
     }
 
     if (!g.damBuilt && g.score >= g.damPromptScore && g.storedWater >= damAtStored) {
       s.buildDam();
     }
 
     if (!g.damBuilt && g.score > 128 && g.storedWater >= 25) {
       s.buildDam();
     }
 
     g.frame += 1;
     s.updateRiver();
     if (Math.random() < g.rainIntensity) {
       s.spawnDrop();
     }
     s.updateDrops();
     s.maybeShowDamSuggestion();
     s.updateStoredWaterDrain(s.performance.now());
     s.updateFlourishWin(s.performance.now());
     s.checkFloodLoss();
   }
 
   return {
     state: s.game.state,
     score: s.game.score,
     storedWater: s.game.storedWater,
     damBuilt: s.game.damBuilt
   };
 }
 
 function runMany(n = 100, opts = {}) {
   let won = 0;
   let lost = 0;
   let other = 0;
   let totalScore = 0;
   let totalStored = 0;
 
   for (let i = 0; i < n; i += 1) {
     const result = runTrial(opts);
     totalScore += result.score;
     totalStored += result.storedWater;
 
     if (result.state === 'won') {
       won += 1;
     } else if (result.state === 'lost') {
       lost += 1;
     } else {
       other += 1;
     }
   }
 
   return {
     n,
     won,
     lost,
     other,
     winRate: won / n,
     avgScore: totalScore / n,
     avgStored: totalStored / n,
     opts
   };
 }
 
 const n = Number(process.argv[2] || 100);
 const damAtStored = Number(process.argv[3] || 95);
 const maxSeconds = Number(process.argv[4] || 80);
const postDamRainIntensity = process.argv[5] !== undefined ? Number(process.argv[5]) : null;
const drainAmountPerTick = process.argv[6] !== undefined ? Number(process.argv[6]) : null;
 
console.log(JSON.stringify(runMany(n, {
  damAtStored,
  maxSeconds,
  postDamRainIntensity,
  drainAmountPerTick
}), null, 2));
 