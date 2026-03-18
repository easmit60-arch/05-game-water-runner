# Water Runner Prompts Guide

This README formats the previous and following prompts into one place so you can quickly reuse them with GitHub Copilot.

## Project File Alignment

- Primary playable game (Prompt 8 mechanics): `index.html`
- Prompt guide text (all prompts): `README.md`
- Archived prompt-guide page snapshot: `prompts-guide.html`
- Compatibility redirect: `snake.html` → `index.html`
- Prompt 6 HTML/CSS-only prototype: `prompt6-water-runner.html` + `prompt6-water-runner.css`
- Legacy starter files from the earlier grid game: `script.js` + `style.css` (kept for reference)

## Prompt 1: Theme + Mechanics Planning

### Goal
Create a Snake-like game using HTML, CSS, and JavaScript where:
- The snake is a river
- The player collects water droplets
- Water is stored in a water can

### Key Considerations
- Define the core loop: move, collect, store, survive
- Use a clear can capacity (for example, `12`) so there is a win target
- Add HUD info: score, stored water, capacity
- Choose boundary behavior: wrap-around or wall collision
- Add start/playing/win/lose game states
- Prevent water drops from spawning inside the river body

### Prompt 1 (Copy/Paste)
```text
I want to create a simple Snake-like game using HTML, CSS, and JavaScript. I want the snake to be a river, and people would collect water drops and store water in a water can.

Please suggest key considerations and gameplay mechanics for:
- Core loop
- Difficulty progression
- HUD design
- Win/lose states
- Fair spawning logic
```

---

## Prompt 2: Single-Player Game Generation Prompt

### Figma Reference
- Board: https://embed.figma.com/board/c9WVeXOsg0Du7TdWuMdypq/Water-Charity?node-id=0-1&embed-host=share

### Required Feature Spec

#### 1) Game Start
When the game first loads:
- Pixel-art title: **Water Runner: Retro Impact**
- Subtitle: **Collect. Build. Deliver.**
- **Press Start** button
- Optional toggle: **Enable AI Assistant**

When gameplay begins:
- Small 2D map loads
- Top of screen: falling water droplets spawn
- Bottom: dry village (brown trees, cracked earth)
- Player starts centered near bottom
- UI visible:
  - Water Tank Meter (stored water)
  - Score counter
  - Infrastructure buttons (Well / River / Dam)
  - AI Helper icon (Clippy-style NPC)
- Minimal pixel sound effects

#### 2) Player Actions
- Movement
- Collecting
- Building
- AI Assistant Interaction

#### 3) Game Logic
**Collect → Spend → Route → Deliver → Transform**

#### 4) Score / Feedback
- Score increases
- Visual feedback
- Educational feedback
- Audio feedback

#### 5) Win / Lose Conditions
Win:
- Village reaches **Thriving** state
- Final message:
  - “You delivered 10,000 virtual liters.”
  - “Real impact starts here.”
  - Button: “Support Real Water Access”

Lose (light, not punishing):
- Water tank reaches 0
- Player misses 10 droplets consecutively

### Narrative Summary
Water Runner draws inspiration from early mobile classics like Snake and Tetris — intentionally simple, pixel-styled, and accessible. The gameplay loop is intuitive: players collect falling water droplets, use them to build wells, rivers, and dams, and deliver clean water to a dry village. As water reaches the community, the landscape visibly transforms from barren to thriving — reinforcing the visual story at the heart of charity: water’s work.

### Prompt 2 (Copy/Paste)
```text
Build a single-player, retro pixel-art browser game called “Water Runner: Retro Impact” using only HTML, CSS, and vanilla JavaScript (no external libraries).

Required flow:
1) Start screen with title, subtitle “Collect. Build. Deliver.”, Press Start button, and optional “Enable AI Assistant” toggle.
2) Gameplay scene with falling droplets at top, dry village at bottom, player near bottom center.
3) UI always visible: Water Tank Meter, Score, Well/River/Dam buttons, AI helper icon.
4) Core gameplay loop: Collect → Spend → Route → Deliver → Transform.
5) Feedback: score updates, visual cues, educational snippets, minimal retro sounds.
6) Win when village reaches “Thriving” and show:
   - “You delivered 10,000 virtual liters.”
   - “Real impact starts here.”
   - “Support Real Water Access” button.
7) Lose if water tank hits 0 or player misses 10 droplets in a row.

Technical constraints:
- Use finite states: start, playing, won, lost.
- Keep code modular with clear functions for spawn, collision, scoring, routing, UI, and win/lose checks.
- Keep the experience simple, accessible, and performant.

Output format:
- Provide full runnable code.
- Prefer one self-contained HTML file first; optionally show split version for style.css and script.js.
```

---

## Prompt 3: Visual Design + Brand Styling

I want my Snake river game, called **Water Runner**, to have a clean and playful design that aligns with charity: water branding.

### Suggested Look and Feel
- **Style:** clean pixel-art UI, rounded cards, playful but simple HUD, clear contrast for readability
- **Color direction:** charity: water-inspired yellow + blue accents with neutral backgrounds (verify exact values with official brand guide)
- **Starter palette:**
  - Primary yellow: `#FFC907`
  - Deep blue: `#0D3B66`
  - Aqua accent: `#35C7FF`
  - Warm sand: `#F5E6C8`
  - Dark text: `#1F2A37`
  - Off-white: `#F8FBFF`
- **Google Font pairing:** *Baloo 2* (headlines) + *Nunito* (body/UI)
- **Logo use:** place provided charity: water logo in header/start screen with clear spacing
- **Responsive rules:** fluid container, scalable canvas, readable HUD on mobile breakpoints

### Prompt 3 (Copy/Paste)
```text
I want my Snake river game called "Water Runner" to have a clean and playful design.

Please suggest and apply:
1) A color scheme aligned with charity: water brand styling,
2) A visual style direction (pixel-art but modern and readable),
3) A matching Google Font pairing for title + UI text,
4) Responsive CSS rules so layout works well on desktop, tablet, and mobile.

Requirements:
- Use the provided charity: water logo in the UI.
- Follow the charity: water brand guidelines: https://drive.google.com/file/d/1ct4zYRIwHAtxoNQoeaVwWYPdnruSC6sr/view
- Keep the game design clean, playful, accessible, and on-brand.
- Return CSS variables for colors, font import links, and updated style rules.
```

---

## Prompt 4: CSS Generation + Logic Review

Based on the design ideas above, this prompt is for generating new CSS for the Snake River game called **Water Runner**, while also requesting a quick logic critique.

### Context Summary
- Game concept: **Water Runner (Retro Catch + Build)**
- Combines visual impact from Idea 1 with conceptual depth from Idea 3 (AI tradeoff simulator)
- Includes AI-style NPC helper inspired by Clippy (Microsoft Office 97)
- Nostalgic style inspired by early mobile classics (Snake, Tetris): pixel graphics, limited palette, minimal controls
- Educational theme: clean water access + hidden water cost of technology

### Core Gameplay Loop
Collect Water → Build Infrastructure → Deliver to Communities → Repeat

### Phases
1. **Collect**
  - Move left/right to catch falling droplets
  - Each droplet increases stored water
2. **Build**
  - Spend water to build wells, rivers, and basic dams
  - Structures route water toward communities
3. **Deliver**
  - Community transforms: dry → green → thriving
  - Show a short real-world impact fact
  - Increase score

### AI Tradeoff Mechanic
AI helper can:
- Auto-catch droplets for 5 seconds
- Reveal optimal dam placement
- Slow droplet fall speed

Tradeoff:
- AI use costs stored water
- Trigger a visible “data center cooling” animation siphoning water
- Optional balancing idea: AI costs less after infrastructure improves

Educational messages:
- “Did you know? Training one large AI model can use ~700,000 liters of water.”
- “Data centers use millions of gallons of water each year to cool servers.”

### Prompt 4 (Copy/Paste)
```text
Based on my Water Runner game concept, generate a complete CSS redesign only (no HTML or JavaScript changes).

Game context:
- Retro Snake/Tetris-inspired web game for charity: water awareness
- Core loop: Collect Water → Build Infrastructure → Deliver to Communities → Repeat
- Includes AI helper tradeoff mechanic (convenience costs water)

CSS requirements:
1) Create a clean, playful, pixel-inspired visual style aligned with charity: water branding.
2) Use a reusable token system with CSS variables (:root) for colors, spacing, radius, shadows, and typography.
3) Include Google Font pairing for headings and body/UI text.
4) Style these areas:
  - Start screen
  - Game canvas/container
  - HUD (score, tank meter, status)
  - Build buttons (Well/River/Dam)
  - AI helper button/icon and warning/cost states
  - Educational popups
  - Win/Lose overlays
5) Add responsive breakpoints for desktop, tablet, and mobile.
6) Ensure accessibility (contrast, focus states, readable text, reduced-motion support).
7) Keep visuals nostalgic but polished (simple borders, blocky/pixel feel, light playful accents).

Also include a short critique of my game logic:
- Confirm whether the loop/mechanics make sense.
- Identify weaknesses or risks.
- Suggest 5 practical improvements (especially around balance, clarity, and player onboarding).
```

### Logic Weaknesses + Improvement Opportunities
- **Complexity risk:** players may feel overloaded by collect/build/route/AI decisions at once.
- **Pacing risk:** AI cost and infrastructure cost can double-drain resources and stall progress.
- **Clarity risk:** tradeoff consequences may be unclear without strong UI previews.
- **Flow risk:** educational popups can interrupt active play if timed poorly.
- **Balance risk:** win/lose pacing may feel unfair without catch-up mechanics.

Suggested improvements:
1. Add a 60–90 second onboarding phase that unlocks mechanics gradually.
2. Show projected water cost before AI or build actions are confirmed.
3. Use non-blocking tooltip/toast facts instead of modal interruptions.
4. Add adaptive difficulty (drop-rate smoothing when player is struggling).
5. Add “recovery paths” (small passive refill or streak bonuses) to avoid deadlock states.

---

## Prompt 5: Confetti Milestones (Timed Score)

Use this prompt to add celebration effects based on time-limited score milestones.

### Milestone Rules
- Trigger confetti if water score reaches `10` in under `10` seconds
- Trigger confetti if water score reaches `30` (or greater) in under `30` seconds

### Prompt 5 (Copy/Paste)
```text
Update my Water Runner game to use a JavaScript confetti library and trigger confetti for timed score milestones.

Requirements:
1) Use a lightweight JS confetti library (prefer canvas-confetti).
2) Add milestone logic based on elapsed game time:
  - Trigger confetti when water score reaches 10 in under 10 seconds.
  - Trigger confetti when water score reaches 30 or more in under 30 seconds.
3) Ensure each milestone confetti effect fires only once per game run.
4) Reset milestone flags when a new game starts.
5) Keep existing gameplay logic intact (no unrelated feature changes).
6) Add clear helper functions, e.g.:
  - checkTimedMilestones(score, elapsedSeconds)
  - launchConfetti(level)
7) If the confetti library is unavailable, fail gracefully without breaking the game.

Output:
- Show the exact code changes needed in HTML/JS.
- Include where to place the library import and milestone checks in the game loop.
```

### Prompt 5.1 (Copy/Paste - Directly in `index.html`)
```text
Implement Prompt 5 directly in my existing index.html game.

Do these exact changes:
1) Add canvas-confetti via CDN script tag in index.html.
2) Track elapsed seconds from the moment gameplay starts.
3) Trigger confetti when:
   - water value reaches 10 in under 10 seconds
   - water value reaches 30 or more in under 30 seconds
4) Fire each confetti milestone only once per run.
5) Reset milestone flags and timer on restart/new game.
6) Keep all current game mechanics and UI behavior unchanged.
7) Fail gracefully if confetti library is unavailable.

Implementation details:
- Add helper functions:
  - launchConfetti(level)
  - checkTimedMilestones(waterValue, elapsedSeconds)
- Call `checkTimedMilestones` immediately after water value increases.
- Add a small on-screen message when confetti milestone is hit.

Return:
- A patch-style response showing exactly what changed in index.html.
```

---

## Prompt 6: HTML + CSS Only Water Runner Screen

Create only the HTML and CSS for Water Runner with a sleek charity: water-inspired visual design.

### Design Targets
- Small raindrops fall from top to bottom in randomized motion
- Clicking/tapping drops collects water and grows a long blue river line (Snake-inspired accumulation)
- Water can be collected and dammed with water tins
- Dry village base style: tans, beige, warm earth tones
- Thriving village style once score is over 20: deep greens, light blues, soft yellow sun
- Use charity: water branding tone and typography hierarchy for instructions, score, and congratulations

### Prompt 6 (Copy/Paste)
```text
Create only HTML and CSS for a game mockup called Water Runner.

Requirements:
1) No JavaScript. Use only semantic HTML + CSS.
2) Add small raindrops that animate from top to bottom with varied positions, delays, and speeds.
3) Make droplets clickable (CSS-only pattern like checkbox + label is allowed).
4) As droplets are collected, visually grow a long blue river line (Snake-like accumulation effect).
5) Include water tins and a simple dam visual to show collection and storage.
6) Design a dry village using tans/beige/browns.
7) When score is over 20, switch to a thriving village palette using deep greens, light blues, and a soft yellow sun.
8) Include charity: water-style branding layout with logo, score, instructions, and congratulations message typography.
9) Keep design sleek, clean, and responsive across desktop/tablet/mobile.

Output:
- Return a complete HTML file and a complete CSS file only.
```

### Prompt 6.1 (Copy/Paste - Implement in New Files)
```text
Implement Prompt 6 in two new files:
- prompt6-water-runner.html
- prompt6-water-runner.css

Constraints:
- HTML + CSS only (no JavaScript)
- Include charity: water logo usage and clean, playful UI
- CSS-only score simulation and threshold state styling for 20+
- Responsive breakpoints and reduced-motion support

After generating code, summarize how the dry -> thriving transformation is triggered.
```

---

## Prompt 7: Dam Decision + Flood Consequence

Add a decision checkpoint around mid-score where players must build a dam with water tins to protect the village.

### Gameplay Rules
- When Water Runner score is over `25`, prompt the player to build a dam
- Instruct them to use filled water tins for dam construction
- Once a dam is built, force river flow toward the dry village and show a flourishing green village
- If no dam is built by `35` score, trigger a flood loss state
- Flood state should cover the screen in deep blue water, include bubble visuals, and display a clear loss message

### Prompt 7 (Copy/Paste)
```text
Update Water Runner with dam-and-flood game logic.

Rules to implement:
1) When score is greater than 25, prompt the player to build a dam.
2) Tell the player to use water tins to build the dam.
3) Water tins should visibly fill up and then be used for dam construction.
4) When dam is successfully built:
   - Force river flow toward the dry village.
   - Show a green, flourishing village state.
5) If player does NOT build a dam by 35 score:
   - Trigger flood loss.
   - Cover the screen with deep blue flood water.
   - Show bubbles and a clear “You lost” message.

Implementation notes:
- Keep existing movement/collection mechanics.
- Add clear status messaging for warning, success, and failure states.
- Include a keyboard shortcut or button for building the dam.
```

### Prompt 7.1 (Copy/Paste - Directly in `index.html`)
```text
Implement Prompt 7 directly in index.html with minimal code changes.

Technical requirements:
- Add state flags: damBuilt, damPromptShown, floodTriggered.
- Use score thresholds:
  - Prompt at score > 25
  - Flood loss at score >= 35 if damBuilt is false
- Add tin indicators in HUD and a Build Dam control (button and/or key shortcut).
- On successful dam build:
  - Consume required tins
  - Change village visuals to thriving (greens, healthier look)
  - Show success message
- On flood loss:
  - Draw deep-blue screen overlay with bubble circles
  - Show loss text and restart instruction
```

---

## Prompt 8: Start-Click River Snake + Rain Storm Collection

This prompt focuses on a side-to-side river snake that grows from bottom collection of energetic falling rain drops.

### Gameplay Rules
- Player clicks **Start** to begin
- River snake can move only left/right
- Rain drops fall top-to-bottom with random, energetic motion
- Each collected drop adds **+1** score
- River snake grows as drops are collected and builds up across the bottom area
- At score `25`, suggest building a dam with water tins
- Dammed flow should route water toward the village in the top-left
- Clear dam suggestion before score reaches `30`

### Prompt 8 (Copy/Paste)
```text
Update Water Runner with this exact behavior:

1) On Start button click, spawn a river snake at the bottom of the screen.
2) River snake movement is left/right only.
3) Spawn water drops from top to bottom with energetic random rain movement.
4) On each drop collected by the river snake:
  - Add +1 to score
  - Grow river snake length
5) At score 25:
  - Prompt player to build a dam with water tins
  - Explain that tins force the river flow toward the top-left village
6) Clear/remove suggestion before score reaches 30.

Visual requirements:
- Keep charity: water style cues and readable UI.
- Show dry village in top-left and improved/flourishing village after successful damming.
```

### Prompt 8.1 (Copy/Paste - Directly in `index.html`)
```text
Implement Prompt 8 directly in index.html.

Technical requirements:
- Add Start button-based game launch.
- Restrict movement input to ArrowLeft/ArrowRight.
- Replace single target with multiple falling rain drops (randomized velocity and drift).
- Collision with river snake segments adds +1 score and grows river length.
- Keep snake flow slow and anchored near bottom.
- At score >= 25 and < 30, show dam suggestion text.
- Add water tin indicators and Build Dam control.
- If dam builds successfully, render visible water flow toward top-left village and flourishing village state.
- At score >= 30, clear suggestion text if still visible.
```

---

## Following Prompt Template (Next Iteration)

Use this for your next refinement request after Copilot generates version 1:

```text
Refactor the current Water Runner game without adding new features.
Keep all existing mechanics, but improve:
1) readability (clear naming + smaller functions),
2) balance (spawn rate and difficulty curve),
3) UI clarity (HUD alignment and status messaging),
4) bug fixes (collision, missed-drop counting, win/lose reliability).

Return updated code and a short changelog.
```

