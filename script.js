/* ==========================================================================
   DIWALI DHAMAKA SPIN & WIN - COMPLETE INTERACTIVE LOGIC (V2)
   ========================================================================== */

// 5 Slices configuration
// Strict rule: do NOT edit or alter original GIFs; they are referenced as-is.
const PRIZES = [
  {
    id: 'mia',
    name: 'MIA KHALIFA',
    wheelImg: 'public/mia khalifa.png',
    winGif: 'mia khalifa.gif',
    badge: '🎉 BUMPER DIWALI DHAMAKA! 🪔',
    title: 'YOU WON MIA KHALIFA! 💃🔥',
    ribbon: 'DIWALI SPECIAL MIA NE DIYA! 💃',
    desc: 'Badhai ho! Aapki Diwali ban gayi sabse colourful aur explosive! Delivery dispatched to your doorstep! 😉🎁',
    extra: '💥 Share with your friends on WhatsApp to celebrate your Diwali win!',
    shareText: '🪔 *DIWALI SPECIAL SURPRISE!* 🪔\n\nYaar ye Diwali Lucky Draw bahut majedar hai!! 😭😂\nAbhi spin karke try surprise dekho: 👇\n',
    isMystery: false
  },
  {
    id: 'jonny',
    name: 'JONNY SINS',
    wheelImg: 'public/jonny sins.png',
    winGif: 'Jonny sins.gif',
    badge: '👨‍⚕️ MULTI-TALENTED DHAMAKA! 🪔',
    title: 'YOU WON JONNY SINS! 👨‍⚕️🚀',
    ribbon: 'THE ALL-ROUNDER WINNER! 🛠️',
    desc: 'Badhai ho! World-famous Doctor, Engineer, Plumber & Astronaut Jonny Bhaiya is arriving at your house this Diwali! 🩺',
    extra: '💥 Any household problem or emergency? Jonny bhaiya will fix it all!',
    shareText: '🪔 *DIWALI SPECIAL SURPRISE!* 🪔\n\nYaar ye Diwali Lucky Draw bahut majedar hai!! 😭😂\nAbhi spin karke try surprise dekho: 👇\n',
    isMystery: false
  },
  {
    id: 'mystery',
    name: 'MYSTERY BOX',
    wheelImg: 'public/mystery-box.png',
    winGif: 'Donkey.gif',
    badge: '💥 OOPS! KISMAT KHARAB NIKLI! 🤣',
    title: 'YOU WON GADHE KA LAND! 🫏🍆',
    ribbon: 'YE LE GADHE KA LAND! 🫏',
    desc: 'Bhai Diwali par sabko sona-chandi milta hai... Teri kismat mein Gadhe ka Land nikla! 😂😭',
    extra: '💥 Shubh Deepawali! Send this to 5 friends on WhatsApp to remove your bad luck!',
    shareText: '🪔 *DIWALI SPECIAL SURPRISE!* 🪔\n\nYaar ye Diwali Lucky Draw bahut majedar hai!! 😭😂\nAbhi spin karke try surprise dekho: 👇\n',
    isMystery: true
  },
  {
    id: 'sunny',
    name: 'SUNNY LEONE',
    wheelImg: 'public/sunny-leone.png',
    winGif: 'Sunny leony.gif',
    badge: '✨ BABY DOLL DHAMAKA! 🪔',
    title: 'YOU WON SUNNY LEONE! ✨💛',
    ribbon: 'BABY DOLL SONE DI! 👑',
    desc: 'Badhai ho! Baby Doll Sone Di aapke Diwali ke diye roshan karne aa gayi! Happy Diwali! 🪔✨',
    extra: '💥 Claim your VIP Diwali gift before stocks run out!',
    shareText: '🪔 *DIWALI SPECIAL SURPRISE!* 🪔\n\nYaar ye Diwali Lucky Draw bahut majedar hai!! 😭😂\nAbhi spin karke try surprise dekho: 👇\n',
    isMystery: false
  },
  {
    id: 'lana',
    name: 'LANA RHOADES',
    wheelImg: 'public/lana rhoads.png',
    winGif: 'Lana Rhoades.gif',
    badge: '🎆 FULL ROCKET DHAMAKA! 🪔',
    title: 'YOU WON LANA RHOADES! 🎆💖',
    ribbon: 'DIWALI PATAKA BOMB! 💥',
    desc: 'Badhai ho! Diwali ki sabse bada pataka bomb Lana Rhoades aapki hui! Shubh Deepawali! 💥',
    extra: '💥 Dhamakedaar Diwali celebrations guaranteed!',
    shareText: '🪔 *DIWALI SPECIAL SURPRISE!* 🪔\n\nYaar ye Diwali Lucky Draw bahut majedar hai!! 😭😂\nAbhi spin karke try surprise dekho: 👇\n',
    isMystery: false
  }
];

// State variables
let isSpinning = false;
let currentRotation = 0; // Total absolute monotonic rotation angle
let audioCtx = null;
let lastTickTime = 0;
let lastPinDivider = -1;
let currentWinner = null;
let sliceGroupElements = [];

// DOM Elements
const wheelRotator = document.getElementById('wheelRotator');
const slicesContainer = document.getElementById('slicesContainer');
const rimLightsGroup = document.getElementById('rimLightsGroup');
const wheelPointer = document.getElementById('wheelPointer');
const spinBtn = document.getElementById('spinBtn');
const centerSpinHub = document.getElementById('centerSpinHub');
const whatsappShareBtn = document.getElementById('whatsappShareBtn');

// Modal Elements
const prizeModal = document.getElementById('prizeModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const spinAgainBtn = document.getElementById('spinAgainBtn');
const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');
const modalWaText = document.getElementById('modalWaText');
const modalBadge = document.getElementById('modalBadge');
const prizeTitle = document.getElementById('prizeTitle');
const prizeRibbon = document.getElementById('prizeRibbon');
const prizeGif = document.getElementById('prizeGif');
const gifLoader = document.getElementById('gifLoader');
const prizeDescription = document.getElementById('prizeDescription');
const prizeExtraInfo = document.getElementById('prizeExtraInfo');

// Canvas Elements
const fireworksCanvas = document.getElementById('fireworksCanvas');
const confettiCanvas = document.getElementById('confettiCanvas');

/* ==========================================================================
   WEB AUDIO API SOUND SYNTHESIS
   ========================================================================== */
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Crisp mechanical click for wheel ticking
function playTickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(850, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.022);

  gain.gain.setValueAtTime(0.22, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.025);
}

// Celebratory fanfare arpeggio for celebrity wins
function playWinFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
  const startTime = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime + idx * 0.07);

    gain.gain.setValueAtTime(0, startTime + idx * 0.07);
    gain.gain.linearRampToValueAtTime(0.22, startTime + idx * 0.07 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.07 + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime + idx * 0.07);
    osc.stop(startTime + idx * 0.07 + 0.45);
  });
}

// Hilarious comical cartoon donkey "BOING / HEE-HAW" sound
function playDonkeyPrankSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Sound 1: Deep cartoon boing
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(450, now);
  osc1.frequency.exponentialRampToValueAtTime(110, now + 0.35);

  gain1.gain.setValueAtTime(0.38, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.4);

  // Sound 2: Comical vibrating donkey slide
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(220, now + 0.38);
  osc2.frequency.linearRampToValueAtTime(520, now + 0.65);
  osc2.frequency.linearRampToValueAtTime(160, now + 0.95);

  gain2.gain.setValueAtTime(0.28, now + 0.38);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.38);
  osc2.stop(now + 1.15);
}

// Festive cracker burst sound
function playFirecrackerBurst() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.25;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, now);
  filter.frequency.exponentialRampToValueAtTime(180, now + 0.25);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.25);
}

/* ==========================================================================
   RENDER WHEEL WEDGES (FACES FULLY DISPLAYED, NO CIRCLES, LARGER)
   ========================================================================== */
function initWheelVisuals() {
  slicesContainer.innerHTML = '';
  sliceGroupElements = [];
  wheelRotator.removeAttribute('transform');
  wheelRotator.style.transformBox = 'view-box';
  wheelRotator.style.transformOrigin = '260px 260px';
  wheelRotator.style.transform = 'rotate(0deg)';

  // Radius = 230, Center = (260, 260)
  // Wedge covers 72 degrees (-36 deg to +36 deg from top)
  const wedgePath = 'M 260 260 L 124.81 73.93 A 230 230 0 0 1 395.19 73.93 Z';

  PRIZES.forEach((prize, index) => {
    const angle = index * 72; // Center angle for slice
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', `rotate(${angle} 260 260)`);
    group.setAttribute('data-slice-index', index);

    // 1. Wedge slice polygon
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', wedgePath);
    path.setAttribute('fill', `url(#grad-${index})`);
    path.setAttribute('stroke', '#ffd700');
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('class', 'wedge-path');
    group.appendChild(path);

    // 2. Name Label (Positioned towards the outer rim)
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '260');
    text.setAttribute('y', '54');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', "'Poppins', sans-serif");
    text.setAttribute('font-weight', '900');
    text.setAttribute('font-size', '14.5');
    text.setAttribute('fill', '#ffffff');
    text.setAttribute('stroke', '#000000');
    text.setAttribute('stroke-width', '3.5');
    text.setAttribute('paint-order', 'stroke fill');
    text.setAttribute('letter-spacing', '0.8px');
    text.textContent = prize.name;
    group.appendChild(text);

    // 3. FULL CHARACTER FACE (NO CIRCLE, LARGER & UNRESTRICTED)
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('href', encodeURI(prize.wheelImg));
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', encodeURI(prize.wheelImg));
    image.setAttribute('x', '206');
    image.setAttribute('y', '66');
    image.setAttribute('width', '108');
    image.setAttribute('height', '122');
    image.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    image.setAttribute('filter', 'url(#faceShadow)');
    group.appendChild(image);

    // 4. Diwali Decorative Diya / Sparkle at base
    const emblem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    emblem.setAttribute('x', '260');
    emblem.setAttribute('y', '208');
    emblem.setAttribute('text-anchor', 'middle');
    emblem.setAttribute('font-size', '14');
    emblem.setAttribute('fill', '#ffd700');
    emblem.setAttribute('opacity', '0.95');
    emblem.textContent = '✦ 🪔 ✦';
    group.appendChild(emblem);

    slicesContainer.appendChild(group);
    sliceGroupElements.push(group);
  });

  // Render 28 LED bulbs around outer rim (Radius = 246)
  rimLightsGroup.innerHTML = '';
  const numLights = 28;
  const bulbColors = ['#ffd700', '#ff0055', '#ffffff', '#00ffcc'];

  for (let k = 0; k < numLights; k++) {
    const angleRad = (k * (360 / numLights) - 90) * (Math.PI / 180);
    const lx = 260 + 246 * Math.cos(angleRad);
    const ly = 260 + 246 * Math.sin(angleRad);

    const bulb = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bulb.setAttribute('cx', lx.toFixed(2));
    bulb.setAttribute('cy', ly.toFixed(2));
    bulb.setAttribute('r', '4.5');
    bulb.setAttribute('fill', bulbColors[k % bulbColors.length]);
    bulb.setAttribute('stroke', '#2a1602');
    bulb.setAttribute('stroke-width', '1');
    bulb.setAttribute('class', 'rim-bulb');
    rimLightsGroup.appendChild(bulb);
  }
}

// Outer LED bulbs blinking sequence
setInterval(() => {
  const bulbs = document.querySelectorAll('.rim-bulb');
  bulbs.forEach((bulb) => {
    bulb.setAttribute('opacity', Math.random() > 0.4 ? '1' : '0.35');
  });
}, 300);

/* ==========================================================================
   ACCURATE WHEEL POSITION MONITORING & REALISTIC SPINNING PHYSICS
   ========================================================================== */

// Returns slice index (0 to 4) currently under the top pointer (12 o'clock)
function getSliceUnderPointer(rotationDeg) {
  const norm = (360 - (rotationDeg % 360)) % 360;
  return Math.floor(((norm + 36) % 360) / 72) % 5;
}

function spinWheel() {
  if (isSpinning) return;
  getAudioContext();

  isSpinning = true;
  spinBtn.disabled = true;

  // Clear any existing victory glow
  sliceGroupElements.forEach(g => g.classList.remove('active-winner'));

  // Target Prize Selection:
  // Exactly 25% chance for Mystery Box ("GADHE KA LAND"), 75% split equally across the 4 celebrities (18.75% each)
  const rand = Math.random();
  let targetIndex = 0;
  if (rand < 0.25) {
    targetIndex = 2; // Mystery Box ("GADHE KA LAND" - 25% probability)
  } else {
    const celebs = [0, 1, 3, 4]; // Mia Khalifa, Jonny Sins, Sunny Leone, Lana Rhoades (18.75% each)
    targetIndex = celebs[Math.floor(Math.random() * celebs.length)];
  }

  currentWinner = PRIZES[targetIndex];

  // Preload winner's GIF immediately at start of spin (giving it 5.2s head start to cache)
  if (currentWinner && currentWinner.winGif) {
    const preloader = new Image();
    preloader.src = currentWinner.winGif;
  }

  // Mathematical target angle to position slice `targetIndex` directly under the top needle:
  const targetBase = (360 - (targetIndex * 72) % 360) % 360;
  // Natural slight random jitter inside slice boundaries (-15 to +15 deg)
  const jitter = (Math.random() - 0.5) * 30;
  const targetStopAngle = (targetBase + jitter + 360) % 360;

  // Compute forward delta from current monotonic rotation
  const minFullSpins = 7; // 7 thrilling revolutions
  const currentMod = currentRotation % 360;
  let forwardDelta = targetStopAngle - currentMod;
  if (forwardDelta < 0) forwardDelta += 360;

  const totalDistance = minFullSpins * 360 + forwardDelta;
  const startRotation = currentRotation;
  const finalRotation = startRotation + totalDistance;

  const duration = 5200; // 5.2 seconds of smooth, suspenseful deceleration
  const startTime = performance.now();
  lastPinDivider = Math.floor((startRotation + 36) / 72);

  // High-fidelity quartic ease-out deceleration curve
  // Fast thrilling spin initially -> smooth gradual deceleration -> dramatic slow crawl at the end
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function frame(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);

    // Continuous monotonic angle — NEVER modulo 360 during spin animation!
    const deg = startRotation + totalDistance * easedProgress;

    // Apply continuous rotation to SVG wheel around its exact geometric center
    wheelRotator.style.transform = `rotate(${deg}deg)`;

    // REAL-TIME WHEEL MONITORING & NEEDLE PHYSICS:
    // Dividers/pins are every 72 degrees. Pin phase determines physical needle deflection:
    const pinPhase = (deg + 36) % 72;
    let deflection = 0;

    if (pinPhase >= 58) {
      // Pin hits needle from left, pushing it back
      deflection = -(pinPhase - 58) * 1.35;
    } else if (pinPhase < 6) {
      // Needle springs back with elastic bounce
      deflection = (6 - pinPhase) * 1.5;
    } else {
      deflection = 0;
    }
    wheelPointer.style.transform = `rotate(${deflection}deg)`;

    // Detect when divider pin passes pointer to trigger crisp tick sound
    const currentDivider = Math.floor((deg + 36) / 72);
    if (currentDivider !== lastPinDivider) {
      if (now - lastTickTime > 35) { // Minimum interval to prevent audio clipping on hyper-spins
        try { playTickSound(); } catch (e) {}
        lastTickTime = now;
      }
      lastPinDivider = currentDivider;
    }

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      // Set exact final rotation and reset needle
      currentRotation = finalRotation;
      wheelRotator.style.transform = `rotate(${finalRotation}deg)`;
      wheelPointer.style.transform = 'rotate(0deg)';
      onSpinComplete();
    }
  }

  requestAnimationFrame(frame);
}

function onSpinComplete() {
  isSpinning = false;
  spinBtn.disabled = false;

  // Confirm slice under pointer matches winner
  const verifiedIndex = getSliceUnderPointer(currentRotation);
  if (sliceGroupElements[verifiedIndex]) {
    sliceGroupElements[verifiedIndex].querySelector('.wedge-path').style.stroke = '#ffffff';
    sliceGroupElements[verifiedIndex].querySelector('.wedge-path').style.strokeWidth = '4.5';
  }
  // Guarantee winner object strictly matches verified slice under the needle
  if (PRIZES[verifiedIndex]) {
    currentWinner = PRIZES[verifiedIndex];
  }

  // Dramatic suspense pause before revealing prize card
  setTimeout(() => {
    try {
      if (currentWinner.isMystery) {
        playDonkeyPrankSound();
      } else {
        playWinFanfare();
        playFirecrackerBurst();
      }
    } catch (e) {
      console.warn('Audio playback ignored:', e);
    }
    triggerConfettiExplosion();
    showPrizeModal(currentWinner);
  }, 420);
}

/* ==========================================================================
   CONGRATULATIONS PRIZE ANNOUNCEMENT CARD
   ========================================================================== */
function showPrizeModal(prize) {
  if (!prize) return;

  modalBadge.textContent = prize.badge;
  prizeTitle.textContent = prize.title;
  prizeRibbon.textContent = prize.ribbon;
  prizeDescription.textContent = prize.desc;
  prizeExtraInfo.textContent = prize.extra;

  // Custom WhatsApp message
  const currentUrl = window.location.href.split('#')[0];
  const shareText = prize.shareText + currentUrl;
  modalWhatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  if (prize.isMystery) {
    modalWaText.textContent = 'Share to your bestie on WhatsApp 🫏';
    prizeRibbon.style.background = 'linear-gradient(90deg, #d90429 0%, #b5179e 50%, #d90429 100%)';
  } else {
    modalWaText.textContent = 'Share to your bestie on WhatsApp 🔥';
    prizeRibbon.style.background = 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
  }

  // Show loader while the winner GIF is buffering, hide previous image
  if (gifLoader) gifLoader.style.display = 'flex';
  prizeGif.style.display = 'none';

  // Attach fresh image handlers before setting src
  prizeGif.onload = () => {
    if (gifLoader) gifLoader.style.display = 'none';
    prizeGif.style.display = 'block';
  };

  prizeGif.onerror = () => {
    // Graceful fallback to character PNG if network or memory limits fail GIF
    if (gifLoader) gifLoader.style.display = 'none';
    prizeGif.src = prize.wheelImg;
    prizeGif.style.display = 'block';
  };

  // Assign winner GIF (referenced as-is)
  prizeGif.src = prize.winGif;
  prizeGif.alt = prize.name;

  if (typeof prizeModal.showModal === 'function') {
    prizeModal.showModal();
  } else {
    prizeModal.setAttribute('open', '');
  }
}

function closePrizeModal() {
  if (typeof prizeModal.close === 'function') {
    prizeModal.close();
  } else {
    prizeModal.removeAttribute('open');
  }

  // Unmount GIF so it stops playing in background and never lingers
  prizeGif.src = '';
  prizeGif.style.display = 'none';
  if (gifLoader) gifLoader.style.display = 'none';

  // Reset highlighted wedge stroke
  sliceGroupElements.forEach(g => {
    const p = g.querySelector('.wedge-path');
    if (p) {
      p.style.stroke = '#ffd700';
      p.style.strokeWidth = '2.5';
    }
  });
}

/* ==========================================================================
   CONFETTI & FIREWORKS CANVASES
   ========================================================================== */
let confettiParticles = [];
let confettiCtx = null;
let confettiAnimId = null;

function setupConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCtx = confettiCanvas.getContext('2d');
}

function triggerConfettiExplosion() {
  confettiParticles = [];
  const colors = ['#ffd700', '#ff0055', '#00f5d4', '#7b2cbf', '#ffbe0b', '#ffffff', '#ff5400'];
  const count = 130;

  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 24,
      vy: (Math.random() - 0.7) * 22,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.008,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 14
    });
  }

  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
  renderConfetti();
}

function renderConfetti() {
  if (!confettiCtx) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35;
    p.rotation += p.rotSpeed;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      confettiParticles.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.globalAlpha = p.alpha;
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
    confettiCtx.restore();
  }

  if (confettiParticles.length > 0) {
    confettiAnimId = requestAnimationFrame(renderConfetti);
  }
}

// Background Golden Sparkles / Diyas
function setupAmbientFireworks() {
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
  const ctx = fireworksCanvas.getContext('2d');
  const embers = [];

  for (let i = 0; i < 45; i++) {
    embers.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 1,
      speedY: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.4 ? '#ffd700' : '#ff9e00'
    });
  }

  function loop() {
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    embers.forEach(e => {
      e.y -= e.speedY;
      if (e.y < -10) {
        e.y = fireworksCanvas.height + 10;
        e.x = Math.random() * fireworksCanvas.width;
      }
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = e.color;
      ctx.globalAlpha = e.opacity;
      ctx.shadowBlur = 6;
      ctx.shadowColor = e.color;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();
}

// Live Online Visitor Count Fluctuator
function fluctuateOnlineCount() {
  const countEl = document.getElementById('liveOnlineCount');
  if (!countEl) return;
  let count = 18429;
  setInterval(() => {
    count += Math.floor((Math.random() - 0.45) * 8);
    countEl.textContent = count.toLocaleString('en-IN');
  }, 3000);
}

/* ==========================================================================
   EVENT LISTENERS & INITIALIZATION
   ========================================================================== */
function setupEventListeners() {
  // Spin Triggers (Both main CTA button and wheel center hub)
  spinBtn.addEventListener('click', spinWheel);
  centerSpinHub.addEventListener('click', spinWheel);

  // Under-wheel WhatsApp share button setup
  const currentUrl = window.location.href.split('#')[0];
  const generalShareMsg =
    '🪔 *DIWALI MEGA SURPRISE* 🎁\n\n' +
    '🔥 Free Spin & Win contest chal raha hai! Mujhe toh Diwali gift mil gaya!\n' +
    'Tu bhi abhi spin kar aur dekh tera kya nikalta hai! 🤣👇\n' +
    currentUrl;
  whatsappShareBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(generalShareMsg)}`;

  // Modal Close & Light Dismiss
  closeModalBtn.addEventListener('click', closePrizeModal);
  spinAgainBtn.addEventListener('click', () => {
    closePrizeModal();
    setTimeout(() => {
      spinWheel();
    }, 280);
  });

  // Close modal when clicking outside dialog backdrop
  prizeModal.addEventListener('click', (e) => {
    const rect = prizeModal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      closePrizeModal();
    }
  });

  // Window Resize handling (debounced to avoid canvas flicker on mobile address bar scroll)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setupConfettiCanvas();
      if (fireworksCanvas) {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
      }
    }, 150);
  });
}

// Background asset preloader to guarantee fast GIF display for any spin
function preloadPrizeAssets() {
  PRIZES.forEach((p, idx) => {
    // Stagger preloading to not overwhelm low-end devices
    setTimeout(() => {
      const img = new Image();
      img.src = p.winGif;
    }, idx * 600);
  });
}

// On Page Load
document.addEventListener('DOMContentLoaded', () => {
  initWheelVisuals();
  setupEventListeners();
  setupConfettiCanvas();
  setupAmbientFireworks();
  fluctuateOnlineCount();
  preloadPrizeAssets();
});
