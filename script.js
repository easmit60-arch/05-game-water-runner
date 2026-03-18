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
const FLOOD_SCORE_LIMIT = 160;
const WATER_STORAGE_MAX = 100;
const DRAIN_PER_SECOND = 2;
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
  spawnIntervalId: null,
  tickIntervalId: null
};

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
    setStatus(`You lost: score went above ${FLOOD_SCORE_LIMIT}.`);
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
    setStatus('You win! Dam built, flourish time complete, safe score, and storage goal reached.');
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

  game.state = 'start';
  game.score = 0;
  game.storedWater = 0;
  game.reachedMaxStorage = false;
  game.damBuilt = false;
  game.flourishStartMs = 0;

  createGrid();
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

// Run setup once.
resetGame();
