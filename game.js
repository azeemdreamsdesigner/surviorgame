/**
 * SURVIVOR QUEST - Main Game Script
 */

// ==========================================
// 1. ASSETS & AUDIO SYNTHESIZER
// ==========================================

const PLAYER_SKIN_COUNT = 20;
const WEAPON_SKIN_COUNT = 24;

const ASSETS = {
  players: [],
  weapons: [],
  background: null,
  loadedCount: 0,
  totalCount: PLAYER_SKIN_COUNT + WEAPON_SKIN_COUNT + 1
};

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playShoot() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playHit() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }

  playGem() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playLevelUp() {
    if (!this.enabled || !this.ctx) return;
    try {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 0.15);
      });
    } catch (e) {}
  }

  playPlayerHurt() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playGameOver() {
    if (!this.enabled || !this.ctx) return;
    try {
      const notes = [300, 250, 200, 150];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.15 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.15);
        osc.stop(this.ctx.currentTime + i * 0.15 + 0.2);
      });
    } catch (e) {}
  }
}

const audio = new SoundEffects();

function loadAssets(onComplete) {
  let loaded = 0;
  function checkDone() {
    loaded++;
    ASSETS.loadedCount = loaded;
    if (loaded >= ASSETS.totalCount) {
      if (onComplete) onComplete();
    }
  }

  for (let i = 1; i <= PLAYER_SKIN_COUNT; i++) {
    const img = new Image();
    const num = String(i).padStart(3, '0');
    img.src = `Players/asset_${num}.png`;
    img.onload = checkDone;
    img.onerror = checkDone;
    ASSETS.players.push(img);
  }

  for (let i = 1; i <= WEAPON_SKIN_COUNT; i++) {
    const img = new Image();
    const num = String(i).padStart(3, '0');
    img.src = `weapons/asset_${num}.png`;
    img.onload = checkDone;
    img.onerror = checkDone;
    ASSETS.weapons.push(img);
  }

  const bgImg = new Image();
  bgImg.src = 'background/texture.jpg';
  bgImg.onload = checkDone;
  bgImg.onerror = checkDone;
  ASSETS.background = bgImg;
}

// ==========================================
// 2. INPUT MANAGEMENT
// ==========================================

const keys = {};
const mouse = {
  x: 0,
  y: 0,
  isDown: false
};

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.code === 'KeyP' || e.code === 'Escape') {
    togglePause();
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

window.addEventListener('mousemove', (e) => {
  const canvas = document.getElementById('gameCanvas');
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

window.addEventListener('mousedown', (e) => {
  if (e.button === 0) {
    mouse.isDown = true;
    audio.init();
  }
});

window.addEventListener('mouseup', (e) => {
  if (e.button === 0) {
    mouse.isDown = false;
  }
});

// ==========================================
// 3. GAME STATE & ENTITIES
// ==========================================

let canvas, ctx;
let gameState = 'START'; // 'START', 'PLAYING', 'PAUSED', 'LEVELUP', 'GAMEOVER'
let lastTime = 0;
let survivalTimer = 0;
let kills = 0;
let score = 0;

let player;
let projectiles = [];
let enemies = [];
let particles = [];
let gems = [];
let floatingTexts = [];

let spawnTimer = 0;
let spawnInterval = 1000; // ms between enemy spawns

const ALL_UPGRADES = [
  { id: 'multishot', title: 'Multishot', desc: '+1 Additional projectile per shot', icon: '🏹' },
  { id: 'firerate', title: 'Rapid Fire', desc: '+25% Faster shooting speed', icon: '⚡' },
  { id: 'damage', title: 'Heavy Bullets', desc: '+30% Weapon damage', icon: '💥' },
  { id: 'movespeed', title: 'Swift Boots', desc: '+20% Movement speed', icon: '👟' },
  { id: 'maxhp', title: 'Vitality', desc: '+30 Max HP & full heal', icon: '❤️' },
  { id: 'magnet', title: 'Gem Magnet', desc: 'Increases gem pickup range', icon: '🧲' },
  { id: 'pierce', title: 'Piercing Rounds', desc: 'Projectiles pierce through +1 enemy', icon: '🎯' }
];

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetHeight = 58; // Base target height
    this.width = 44;       // Flexible width calculated dynamically
    this.height = this.targetHeight;
    this.speed = 220; // pixels / sec

    // Pick random skin and weapon
    this.skinIndex = Math.floor(Math.random() * PLAYER_SKIN_COUNT);
    this.weaponIndex = Math.floor(Math.random() * WEAPON_SKIN_COUNT);

    this.skinImg = ASSETS.players[this.skinIndex];
    this.weaponImg = ASSETS.weapons[this.weaponIndex];

    this.maxHp = 100;
    this.hp = 100;

    this.level = 1;
    this.exp = 0;
    this.expToNextLevel = 10;

    // Weapon Stats
    this.damage = 25;
    this.fireRate = 4; // shots per second
    this.fireTimer = 0;
    this.bulletCount = 1;
    this.bulletSpeed = 650;
    this.pierce = 1;
    this.pickupRadius = 120;

    this.aimAngle = 0;
    this.facingRight = true;
    this.invulnerableTimer = 0;

    // Procedural Walking Animation Variables
    this.isWalking = false;
    this.walkTimer = 0;
    this.walkRotation = 0;
    this.squeezeX = 1;
    this.squeezeY = 1;
  }

  update(dt) {
    // 8-Directional Keyboard Movement Mechanics
    let dx = 0;
    let dy = 0;

    if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    this.x += dx * this.speed * dt;
    this.y += dy * this.speed * dt;

    // Procedural Walking Animation (squeeze/stretch & rotation wobble)
    if (dx !== 0 || dy !== 0) {
      this.isWalking = true;
      this.walkTimer += dt * 14;
      this.squeezeY = 1 + Math.sin(this.walkTimer) * 0.1;
      this.squeezeX = 1 - Math.sin(this.walkTimer) * 0.08;
      this.walkRotation = Math.cos(this.walkTimer) * 0.12; // tilt left/right
    } else {
      this.isWalking = false;
      this.walkTimer = 0;
      this.squeezeX = 1;
      this.squeezeY = 1;
      this.walkRotation = 0;
    }

    // Aim angle relative to center screen
    const screenX = canvas.width / 2;
    const screenY = canvas.height / 2;
    this.aimAngle = Math.atan2(mouse.y - screenY, mouse.x - screenX);

    if (Math.cos(this.aimAngle) >= 0) {
      this.facingRight = true;
    } else {
      this.facingRight = false;
    }

    // Timers
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    this.fireTimer += dt;
    if (mouse.isDown && this.fireTimer >= (1 / this.fireRate)) {
      this.shoot();
      this.fireTimer = 0;
    }
  }

  getMuzzlePosition() {
    // Calculate flexible weapon dimensions
    const weaponTargetHeight = 22;
    let weaponWidth = 45;
    if (this.weaponImg && this.weaponImg.complete && this.weaponImg.naturalHeight) {
      const aspect = this.weaponImg.naturalWidth / this.weaponImg.naturalHeight;
      weaponWidth = weaponTargetHeight * aspect;
    }

    // Offset of weapon barrel tip relative to player center
    const pivotX = 6;
    const pivotY = 4;
    const muzzleOffsetParallel = pivotX + weaponWidth;
    const muzzleOffsetPerp = this.facingRight ? pivotY : -pivotY;

    // Rotate local muzzle offset by aimAngle into world space
    const muzzleX = this.x + Math.cos(this.aimAngle) * muzzleOffsetParallel - Math.sin(this.aimAngle) * muzzleOffsetPerp;
    const muzzleY = this.y + Math.sin(this.aimAngle) * muzzleOffsetParallel + Math.cos(this.aimAngle) * muzzleOffsetPerp;

    return { x: muzzleX, y: muzzleY };
  }

  shoot() {
    audio.playShoot();
    const muzzle = this.getMuzzlePosition();

    // Muzzle flash particle effect
    for (let k = 0; k < 3; k++) {
      particles.push(new Particle(muzzle.x, muzzle.y, '#fef08a'));
    }

    const spreadAngle = 0.15; // radians between multishot bullets
    const startAngle = this.aimAngle - ((this.bulletCount - 1) * spreadAngle) / 2;

    for (let i = 0; i < this.bulletCount; i++) {
      const angle = startAngle + i * spreadAngle;
      const vx = Math.cos(angle) * this.bulletSpeed;
      const vy = Math.sin(angle) * this.bulletSpeed;
      // Bullets spawn directly at the weapon end point!
      projectiles.push(new Projectile(muzzle.x, muzzle.y, vx, vy, this.damage, this.pierce));
    }
  }

  takeDamage(amount) {
    if (this.invulnerableTimer > 0) return;
    this.hp -= amount;
    this.invulnerableTimer = 0.4;
    audio.playPlayerHurt();
    createDamageText(this.x, this.y - 30, `-${Math.round(amount)}`, '#ef4444');

    if (this.hp <= 0) {
      this.hp = 0;
      gameOver();
    }
    updateHUD();
  }

  gainExp(amount) {
    this.exp += amount;
    audio.playGem();
    if (this.exp >= this.expToNextLevel) {
      this.exp -= this.expToNextLevel;
      this.level++;
      this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);
      triggerLevelUp();
    }
    updateHUD();
  }

  draw(ctx, cameraX, cameraY) {
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;

    // Calculate flexible player width based on image natural aspect ratio (no stretch)
    let renderWidth = this.width;
    let renderHeight = this.height;
    if (this.skinImg && this.skinImg.complete && this.skinImg.naturalHeight) {
      const aspect = this.skinImg.naturalWidth / this.skinImg.naturalHeight;
      renderWidth = renderHeight * aspect;
    }

    ctx.save();
    ctx.translate(screenX, screenY);

    // Flash if invulnerable
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 50) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Render Player Character Sprite with procedural Walking Animation (rotate + squeeze)
    ctx.save();
    if (!this.facingRight) {
      ctx.scale(-1, 1);
    }
    ctx.rotate(this.walkRotation);
    ctx.scale(this.squeezeX, this.squeezeY);

    if (this.skinImg && this.skinImg.complete) {
      ctx.drawImage(this.skinImg, -renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight);
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight);
    }
    ctx.restore();

    // Render Weapon Attached in Hand & Aiming towards Mouse (flexible aspect ratio)
    ctx.save();
    ctx.rotate(this.aimAngle);
    if (!this.facingRight) {
      ctx.scale(1, -1);
    }

    const weaponTargetHeight = 22;
    let weaponWidth = 45;
    if (this.weaponImg && this.weaponImg.complete && this.weaponImg.naturalHeight) {
      const aspect = this.weaponImg.naturalWidth / this.weaponImg.naturalHeight;
      weaponWidth = weaponTargetHeight * aspect;
    }

    if (this.weaponImg && this.weaponImg.complete) {
      ctx.drawImage(this.weaponImg, 6, -11, weaponWidth, weaponTargetHeight);
    } else {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(6, -5, 25, 10);
    }
    ctx.restore();

    ctx.restore();
  }
}

class Projectile {
  constructor(x, y, vx, vy, damage, pierce) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.pierce = pierce;
    this.radius = 6;
    this.life = 2.0;
    this.hitEnemies = new Set();
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
  }

  draw(ctx, cameraX, cameraY) {
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;

    ctx.save();
    ctx.beginPath();
    ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }
}

class Enemy {
  constructor(x, y, levelMultiplier) {
    this.x = x;
    this.y = y;
    this.targetHeight = 52;
    this.width = 40;
    this.height = this.targetHeight;
    this.speed = 100 + Math.random() * 40;

    // Pick random enemy skin
    this.skinIndex = Math.floor(Math.random() * PLAYER_SKIN_COUNT);
    this.skinImg = ASSETS.players[this.skinIndex];

    this.maxHp = Math.round(30 * levelMultiplier);
    this.hp = this.maxHp;
    this.damage = Math.round(10 * levelMultiplier);
    this.expValue = Math.round(3 * levelMultiplier);

    this.walkTimer = Math.random() * 10;
  }

  update(dt, playerX, playerY) {
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 0) {
      this.x += (dx / dist) * this.speed * dt;
      this.y += (dy / dist) * this.speed * dt;
      this.walkTimer += dt * 10;
    }
  }

  draw(ctx, cameraX, cameraY) {
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;

    let renderWidth = this.width;
    let renderHeight = this.height;
    if (this.skinImg && this.skinImg.complete && this.skinImg.naturalHeight) {
      const aspect = this.skinImg.naturalWidth / this.skinImg.naturalHeight;
      renderWidth = renderHeight * aspect;
    }

    ctx.save();
    ctx.translate(screenX, screenY);

    if (this.x > player.x) {
      ctx.scale(-1, 1);
    }

    // Walking animation for enemies
    const walkRot = Math.cos(this.walkTimer) * 0.1;
    const squeezeY = 1 + Math.sin(this.walkTimer) * 0.08;
    ctx.rotate(walkRot);
    ctx.scale(1, squeezeY);

    if (this.skinImg && this.skinImg.complete) {
      ctx.drawImage(this.skinImg, -renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight);
    } else {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight);
    }

    ctx.restore();

    // Draw Enemy Health Bar if damaged
    if (this.hp < this.maxHp) {
      ctx.save();
      const barW = 36;
      const barH = 5;
      const bx = screenX - barW / 2;
      const by = screenY - renderHeight / 2 - 8;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(bx, by, barW, barH);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(bx, by, barW * (this.hp / this.maxHp), barH);
      ctx.restore();
    }
  }
}

class Gem {
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.radius = 6;
    this.isHealth = Math.random() < 0.15;
  }

  update(dt, player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < player.pickupRadius) {
      const speed = 400;
      this.x += (dx / dist) * speed * dt;
      this.y += (dy / dist) * speed * dt;

      if (dist < 20) {
        if (this.isHealth) {
          player.hp = Math.min(player.maxHp, player.hp + 20);
          createDamageText(player.x, player.y - 30, '+20 HP', '#22c55e');
          audio.playGem();
          updateHUD();
        } else {
          player.gainExp(this.value);
        }
        return true;
      }
    }
    return false;
  }

  draw(ctx, cameraX, cameraY) {
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;

    ctx.save();
    ctx.beginPath();
    ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.isHealth ? '#22c55e' : '#3b82f6';
    ctx.shadowColor = this.isHealth ? '#22c55e' : '#60a5fa';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 150;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color;
    this.radius = 2 + Math.random() * 3;
    this.life = 0.3 + Math.random() * 0.3;
    this.maxLife = this.life;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
  }

  draw(ctx, cameraX, cameraY) {
    const screenX = this.x - cameraX;
    const screenY = this.y - cameraY;

    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function createDamageText(x, y, text, color) {
  floatingTexts.push({
    x, y, text, color,
    life: 0.8,
    maxLife: 0.8
  });
}

// ==========================================
// 4. GAME ENGINE & LOOP
// ==========================================

function init() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);

  document.getElementById('start-btn').addEventListener('click', startGame);
  document.getElementById('restart-btn').addEventListener('click', restartGame);
  document.getElementById('resume-btn').addEventListener('click', togglePause);

  loadAssets(() => {
    setupPreviewModal();
  });

  requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function setupPreviewModal() {
  player = new Player(0, 0);

  const skinImgElem = document.getElementById('preview-skin-img');
  const weaponImgElem = document.getElementById('preview-weapon-img');
  const heroNameTag = document.getElementById('hero-name-tag');
  const hudAvatar = document.getElementById('hud-avatar');

  const skinNum = String(player.skinIndex + 1).padStart(3, '0');
  const weaponNum = String(player.weaponIndex + 1).padStart(3, '0');

  skinImgElem.src = `Players/asset_${skinNum}.png`;
  weaponImgElem.src = `weapons/asset_${weaponNum}.png`;
  hudAvatar.src = `Players/asset_${skinNum}.png`;
  heroNameTag.innerText = `Hero #${player.skinIndex + 1}`;
}

function startGame() {
  audio.init();
  gameState = 'PLAYING';

  document.getElementById('start-modal').classList.add('hidden');
  document.getElementById('hud').classList.remove('hidden');

  survivalTimer = 0;
  kills = 0;
  score = 0;
  projectiles = [];
  enemies = [];
  particles = [];
  gems = [];
  floatingTexts = [];

  updateHUD();
}

function restartGame() {
  document.getElementById('gameover-modal').classList.add('hidden');
  setupPreviewModal();
  startGame();
}

function togglePause() {
  if (gameState === 'PLAYING') {
    gameState = 'PAUSED';
    document.getElementById('pause-modal').classList.remove('hidden');
  } else if (gameState === 'PAUSED') {
    gameState = 'PLAYING';
    document.getElementById('pause-modal').classList.add('hidden');
  }
}

function triggerLevelUp() {
  gameState = 'LEVELUP';
  audio.playLevelUp();

  const container = document.getElementById('upgrade-options');
  container.innerHTML = '';

  const shuffled = [...ALL_UPGRADES].sort(() => 0.5 - Math.random());
  const choices = shuffled.slice(0, 3);

  choices.forEach((upg) => {
    const card = document.createElement('div');
    card.className = 'upgrade-card';
    card.innerHTML = `
      <div class="upgrade-icon">${upg.icon}</div>
      <div class="upgrade-title">${upg.title}</div>
      <div class="upgrade-desc">${upg.desc}</div>
    `;
    card.addEventListener('click', () => {
      applyUpgrade(upg.id);
      document.getElementById('levelup-modal').classList.add('hidden');
      gameState = 'PLAYING';
    });
    container.appendChild(card);
  });

  document.getElementById('levelup-modal').classList.remove('hidden');
}

function applyUpgrade(upgradeId) {
  switch (upgradeId) {
    case 'multishot':
      player.bulletCount++;
      break;
    case 'firerate':
      player.fireRate *= 1.25;
      break;
    case 'damage':
      player.damage *= 1.3;
      break;
    case 'movespeed':
      player.speed *= 1.2;
      break;
    case 'maxhp':
      player.maxHp += 30;
      player.hp = player.maxHp;
      break;
    case 'magnet':
      player.pickupRadius += 80;
      break;
    case 'pierce':
      player.pierce += 1;
      break;
  }
  updateHUD();
}

function gameOver() {
  gameState = 'GAMEOVER';
  audio.playGameOver();

  document.getElementById('final-time').innerText = formatTimer(survivalTimer);
  document.getElementById('final-kills').innerText = kills;
  document.getElementById('final-level').innerText = player.level;
  document.getElementById('final-score').innerText = score;

  document.getElementById('gameover-modal').classList.remove('hidden');
}

function spawnEnemy() {
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.hypot(canvas.width, canvas.height) / 2 + 100;
  const ex = player.x + Math.cos(angle) * dist;
  const ey = player.y + Math.sin(angle) * dist;

  const levelMult = 1 + (survivalTimer / 60) * 0.4;
  enemies.push(new Enemy(ex, ey, levelMult));
}

function updateHUD() {
  document.getElementById('hp-bar-inner').style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;
  document.getElementById('hp-text').innerText = `${Math.round(player.hp)} / ${Math.round(player.maxHp)}`;

  document.getElementById('exp-bar-inner').style.width = `${Math.min(100, (player.exp / player.expToNextLevel) * 100)}%`;
  document.getElementById('exp-text').innerText = `Lvl ${player.level} (${player.exp} / ${player.expToNextLevel})`;

  document.getElementById('kills-display').innerText = kills;
  document.getElementById('score-display').innerText = score;
  document.getElementById('timer-display').innerText = formatTimer(survivalTimer);
}

function formatTimer(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ==========================================
// 5. MAIN GAME LOOP
// ==========================================

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
  lastTime = timestamp;

  if (gameState === 'PLAYING') {
    survivalTimer += dt;
    score = Math.floor(survivalTimer * 10 + kills * 50);

    player.update(dt);

    spawnTimer += dt * 1000;
    const currentInterval = Math.max(250, spawnInterval - (survivalTimer / 30) * 100);
    if (spawnTimer >= currentInterval) {
      spawnEnemy();
      spawnTimer = 0;
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      p.update(dt);
      if (p.life <= 0) {
        projectiles.splice(i, 1);
      }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.update(dt, player.x, player.y);

      const distToPlayer = Math.hypot(e.x - player.x, e.y - player.y);
      if (distToPlayer < (e.width / 2 + player.width / 3)) {
        player.takeDamage(e.damage);
      }

      for (let j = projectiles.length - 1; j >= 0; j--) {
        const p = projectiles[j];
        if (p.hitEnemies.has(e)) continue;

        const distToProj = Math.hypot(e.x - p.x, e.y - p.y);
        if (distToProj < (e.width / 2 + p.radius)) {
          e.hp -= p.damage;
          p.hitEnemies.add(e);
          audio.playHit();
          createDamageText(e.x, e.y - 20, Math.round(p.damage), '#facc15');

          for (let k = 0; k < 4; k++) {
            particles.push(new Particle(e.x, e.y, '#ef4444'));
          }

          if (p.hitEnemies.size >= p.pierce) {
            projectiles.splice(j, 1);
          }

          if (e.hp <= 0) {
            kills++;
            gems.push(new Gem(e.x, e.y, e.expValue));
            enemies.splice(i, 1);

            for (let k = 0; k < 10; k++) {
              particles.push(new Particle(e.x, e.y, '#94a3b8'));
            }
            break;
          }
        }
      }
    }

    for (let i = gems.length - 1; i >= 0; i--) {
      if (gems[i].update(dt, player)) {
        gems.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update(dt);
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }

    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y -= 30 * dt;
      ft.life -= dt;
      if (ft.life <= 0) {
        floatingTexts.splice(i, 1);
      }
    }

    updateHUD();
  }

  render();

  requestAnimationFrame(gameLoop);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cameraX = player ? player.x - canvas.width / 2 : 0;
  const cameraY = player ? player.y - canvas.height / 2 : 0;

  if (ASSETS.background && ASSETS.background.complete) {
    const tw = ASSETS.background.width || 554;
    const th = ASSETS.background.height || 554;

    const startX = Math.floor(cameraX / tw) * tw - cameraX;
    const startY = Math.floor(cameraY / th) * th - cameraY;

    for (let x = startX; x < canvas.width; x += tw) {
      for (let y = startY; y < canvas.height; y += th) {
        ctx.drawImage(ASSETS.background, x, y, tw, th);
      }
    }
  } else {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (!player) return;

  gems.forEach((g) => g.draw(ctx, cameraX, cameraY));
  enemies.forEach((e) => e.draw(ctx, cameraX, cameraY));
  player.draw(ctx, cameraX, cameraY);
  projectiles.forEach((p) => p.draw(ctx, cameraX, cameraY));
  particles.forEach((pt) => pt.draw(ctx, cameraX, cameraY));

  floatingTexts.forEach((ft) => {
    const screenX = ft.x - cameraX;
    const screenY = ft.y - cameraY;
    ctx.save();
    ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
    ctx.font = 'bold 16px "Press Start 2P", monospace';
    ctx.fillStyle = ft.color;
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.fillText(ft.text, screenX, screenY);
    ctx.restore();
  });
}

window.addEventListener('DOMContentLoaded', init);
