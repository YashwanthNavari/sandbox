// State Variables
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let autoplayInterval = null;
let isAutoplayActive = false;

// DOM Elements
const currentSlideNumEl = document.getElementById('current-slide-num');
const totalSlidesNumEl = document.getElementById('total-slides-num');
const prevBtn = document.getElementById('btn-prev');
const nextBtn = document.getElementById('btn-next');
const autoplayBtn = document.getElementById('btn-autoplay');
const autoplayIcon = document.getElementById('autoplay-icon');
const fullscreenBtn = document.getElementById('btn-fullscreen');
const drawerBtn = document.getElementById('btn-drawer');
const overviewDrawer = document.getElementById('slide-overview-drawer');
const closeDrawerBtn = document.getElementById('btn-close-drawer');
const drawerGridContainer = document.getElementById('drawer-grid-container');

// -------------------------------------------------------------
// Slide Navigation Functions
// -------------------------------------------------------------
function showSlide(index) {
  if (index < 0) index = 0;
  if (index >= totalSlides) index = totalSlides - 1;

  currentSlideIndex = index;

  // Update Slide Class Lists
  slides.forEach((slide, i) => {
    slide.classList.remove('active', 'prev');
    if (i === currentSlideIndex) {
      slide.classList.add('active');
    } else if (i < currentSlideIndex) {
      slide.classList.add('prev');
    }
  });

  // Update Slide Counter
  if (currentSlideNumEl) currentSlideNumEl.textContent = currentSlideIndex + 1;
  if (totalSlidesNumEl) totalSlidesNumEl.textContent = totalSlides;

  // Update Side Dot Indicators
  const sideDots = document.querySelectorAll('.side-dots .dot');
  sideDots.forEach((dot, i) => {
    if (i === currentSlideIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // Update Drawer active state
  const thumbs = document.querySelectorAll('.drawer-thumb');
  thumbs.forEach((thumb, i) => {
    if (i === currentSlideIndex) {
      thumb.classList.add('active');
    } else {
      thumb.classList.remove('active');
    }
  });
}

function nextSlide() {
  if (currentSlideIndex < totalSlides - 1) {
    showSlide(currentSlideIndex + 1);
  } else if (isAutoplayActive) {
    showSlide(0); // Loop to start during autoplay
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    showSlide(currentSlideIndex - 1);
  }
}

// -------------------------------------------------------------
// Autoplay Controller
// -------------------------------------------------------------
function toggleAutoplay() {
  if (isAutoplayActive) {
    clearInterval(autoplayInterval);
    autoplayBtn.classList.remove('active');
    autoplayIcon.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`;
    isAutoplayActive = false;
  } else {
    autoplayInterval = setInterval(nextSlide, 5000); // 5 seconds per slide
    autoplayBtn.classList.add('active');
    autoplayIcon.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    isAutoplayActive = true;
    nextSlide();
  }
}

// -------------------------------------------------------------
// Fullscreen Controller
// -------------------------------------------------------------
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

// -------------------------------------------------------------
// Overview Slide Drawer Generator
// -------------------------------------------------------------
function buildOverviewDrawer() {
  drawerGridContainer.innerHTML = '';
  
  slides.forEach((slide, i) => {
    const titleText = slide.querySelector('h2')?.textContent || slide.querySelector('h1')?.textContent || `Slide ${i+1}`;
    
    const thumb = document.createElement('div');
    thumb.className = `drawer-thumb ${i === currentSlideIndex ? 'active' : ''}`;
    thumb.setAttribute('data-target-slide', i);
    
    thumb.innerHTML = `
      <div class="drawer-thumb-num">SLIDE ${String(i + 1).padStart(2, '0')}</div>
      <div class="drawer-thumb-title">${titleText}</div>
    `;
    
    thumb.addEventListener('click', () => {
      showSlide(i);
      closeDrawer();
    });
    
    drawerGridContainer.appendChild(thumb);
  });
}

function openDrawer() {
  buildOverviewDrawer();
  overviewDrawer.classList.add('open');
}

function closeDrawer() {
  overviewDrawer.classList.remove('open');
}

// -------------------------------------------------------------
// Navigation Event Listeners Binding
// -------------------------------------------------------------
function registerEventListeners() {
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (autoplayBtn) autoplayBtn.addEventListener('click', toggleAutoplay);
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
  if (drawerBtn) drawerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Escape') {
      closeDrawer();
    } else if (e.key.toLowerCase() === 'f') {
      toggleFullscreen();
    }
  });

  // Navigation side dots
  const sideDots = document.querySelectorAll('.side-dots .dot');
  sideDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide-target') || dot.getAttribute('data-slide'));
      showSlide(slideIndex);
    });
  });

  // Touch Swipe handlers for trackpads / touchscreens
  let touchstartX = 0;
  let touchendX = 0;

  document.addEventListener('touchstart', (e) => {
    touchstartX = e.changedTouches[0].screenX;
  }, false);

  document.addEventListener('touchend', (e) => {
    touchendX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    const threshold = 50;
    if (touchendX < touchstartX - threshold) {
      nextSlide();
    }
    if (touchendX > touchstartX + threshold) {
      prevSlide();
    }
  }
}

// -------------------------------------------------------------
// Application Bootstrapper
// -------------------------------------------------------------
function registerMockupListeners() {
  // 1. Login Mockup Interactions
  const btnMockLogin = document.getElementById('btn-mock-login');
  const btnMockFingerprint = document.getElementById('btn-mock-fingerprint');
  const loginFeedback = document.getElementById('mock-login-feedback');
  
  if (btnMockLogin && loginFeedback) {
    btnMockLogin.addEventListener('click', () => {
      loginFeedback.textContent = 'Verifying PIN...';
      loginFeedback.style.color = 'var(--color-primary)';
      btnMockLogin.disabled = true;
      
      setTimeout(() => {
        loginFeedback.textContent = 'Access Granted ✓';
        loginFeedback.style.color = 'var(--color-emerald)';
        btnMockLogin.disabled = false;
      }, 1200);
    });
  }
  
  if (btnMockFingerprint && loginFeedback) {
    btnMockFingerprint.addEventListener('click', () => {
      loginFeedback.textContent = 'Scanning Biometric Key...';
      loginFeedback.style.color = 'var(--color-purple)';
      
      setTimeout(() => {
        loginFeedback.textContent = 'Biometric Verified ✓';
        loginFeedback.style.color = 'var(--color-emerald)';
      }, 1000);
    });
  }

  // 2. Watchdog Observer Switches
  const toggles = document.querySelectorAll('.observer-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      
      // Update badge count in Slide 14 (previously 13)
      const activeCount = document.querySelectorAll('.observer-toggle.active').length;
      const targetSlide = slides[13];
      if (targetSlide) {
        // Find the span containing the badge
        const badgeSpan = Array.from(targetSlide.querySelectorAll('span')).find(el => el.textContent.includes('Obs'));
        if (badgeSpan) {
          badgeSpan.textContent = `${activeCount} Obs`;
        }
      }
    });
  });
}

// -------------------------------------------------------------
// Presentation Mode Controller (Auto-Hide cursor during fullscreen)
// -------------------------------------------------------------
function registerPresentationModeController() {
  let mouseIdleTimer = null;

  function showCursor() {
    document.body.style.cursor = 'default';
    if (mouseIdleTimer) clearTimeout(mouseIdleTimer);
    
    if (document.body.classList.contains('presentation-mode')) {
      mouseIdleTimer = setTimeout(() => {
        document.body.style.cursor = 'none';
      }, 2500);
    }
  }

  // Monitor fullscreen state to toggle presentation mode
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      document.body.classList.add('presentation-mode');
      showCursor();
      document.addEventListener('mousemove', showCursor);
      document.addEventListener('keydown', showCursor);
    } else {
      document.body.classList.remove('presentation-mode');
      document.body.style.cursor = 'default';
      document.removeEventListener('mousemove', showCursor);
      document.removeEventListener('keydown', showCursor);
      if (mouseIdleTimer) clearTimeout(mouseIdleTimer);
    }
  });
}

// ─── Inject Premium Animation CSS ───────────────────────────────
function injectAnimationStyles() {
  const style = document.createElement('style');
  style.id = 'premium-animations';
  style.textContent = [
    '.slide{filter:blur(4px);transform:translateX(50px) scale(0.97);transition:opacity 0.65s cubic-bezier(0.16,1,0.3,1),transform 0.65s cubic-bezier(0.16,1,0.3,1),filter 0.5s ease}',
    '.slide.active{filter:blur(0px);transform:translateX(0) scale(1)}',
    '.slide.prev{filter:blur(4px);transform:translateX(-50px) scale(0.97)}',
    '@keyframes orbFloat1{0%{transform:translate(0,0) scale(1)}33%{transform:translate(60px,-40px) scale(1.1)}66%{transform:translate(-30px,50px) scale(0.95)}100%{transform:translate(0,0) scale(1)}}',
    '@keyframes orbFloat2{0%{transform:translate(0,0) scale(1)}40%{transform:translate(-50px,60px) scale(1.08)}80%{transform:translate(40px,-30px) scale(0.92)}100%{transform:translate(0,0) scale(1)}}',
    '@keyframes orbFloat3{0%{transform:translate(0,0) scale(1)}50%{transform:translate(80px,30px) scale(1.05)}100%{transform:translate(0,0) scale(1)}}',
    '.bg-glow-1{animation:orbFloat1 18s ease-in-out infinite;opacity:0.35}',
    '.bg-glow-2{animation:orbFloat2 22s ease-in-out infinite;opacity:0.28}',
    '.bg-glow-3{position:absolute;width:500px;height:500px;top:40%;left:40%;background:radial-gradient(circle,rgba(124,58,237,0.05) 0%,transparent 70%);filter:blur(100px);animation:orbFloat3 26s ease-in-out infinite;opacity:0.22;border-radius:50%;pointer-events:none;z-index:0}',
    '#particle-canvas{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.55}',
    '.cursor-glow{position:fixed;pointer-events:none;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 70%);transform:translate(-50%,-50%);z-index:0;transition:left 0.12s ease,top 0.12s ease;will-change:left,top}',
    '@keyframes badgePop{0%{opacity:0;transform:scale(0.7) translateY(8px)}70%{transform:scale(1.06) translateY(-2px)}100%{opacity:1;transform:scale(1) translateY(0)}}',
    '.slide.active .badge{animation:badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;animation-delay:0.08s}',
    '@keyframes dropIn{from{opacity:0;transform:translateY(-22px)}to{opacity:1;transform:translateY(0)}}',
    '.slide.active .main-title,.slide.active .slide-title{animation:dropIn 0.7s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.18s}',
    '@keyframes dividerWipe{from{transform:scaleX(0);opacity:0}to{transform:scaleX(1);opacity:1}}',
    '.slide.active .cover-divider{animation:dividerWipe 0.6s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.28s;transform-origin:left}',
    '@keyframes flyUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}',
    '.slide.active .sol-card:nth-child(1){animation:flyUp 0.55s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.32s}',
    '.slide.active .sol-card:nth-child(2){animation:flyUp 0.55s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.44s}',
    '.slide.active .sol-card:nth-child(3){animation:flyUp 0.55s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.56s}',
    '.slide.active .sol-card:nth-child(4){animation:flyUp 0.55s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.68s}',
    '.slide.active .glass-card:nth-child(1){animation:flyUp 0.55s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.35s}',
    '.slide.active .glass-card:nth-child(2){animation:flyUp 0.55s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.47s}',
    '.slide.active .glass-card:nth-child(3){animation:flyUp 0.55s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.59s}',
    '@keyframes zoomIn{from{opacity:0;transform:scale(0.92) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}',
    '.slide.active .slide-visual{animation:zoomIn 0.7s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.4s}',
    '@keyframes slideInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}',
    '.slide.active .stack-layer:nth-child(1){animation:slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.30s}',
    '.slide.active .stack-layer:nth-child(2){animation:slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.42s}',
    '.slide.active .stack-layer:nth-child(3){animation:slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.54s}',
    '.slide.active .stack-layer:nth-child(4){animation:slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.66s}',
    '@keyframes nodePop{0%{opacity:0;transform:scale(0.75)}80%{transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}',
    '.slide.active .pipeline-node:nth-child(1){animation:nodePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;animation-delay:0.30s}',
    '.slide.active .pipeline-node:nth-child(2){animation:nodePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;animation-delay:0.42s}',
    '.slide.active .pipeline-node:nth-child(3){animation:nodePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;animation-delay:0.54s}',
    '.slide.active .pipeline-node:nth-child(4){animation:nodePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;animation-delay:0.66s}',
    '.slide.active .pipeline-node:nth-child(5){animation:nodePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;animation-delay:0.78s}',
    '.slide.active .roadmap-step:nth-child(1) .roadmap-dot{animation:flyUp 0.4s both;animation-delay:0.30s}',
    '.slide.active .roadmap-step:nth-child(2) .roadmap-dot{animation:flyUp 0.4s both;animation-delay:0.40s}',
    '.slide.active .roadmap-step:nth-child(3) .roadmap-dot{animation:flyUp 0.4s both;animation-delay:0.50s}',
    '.slide.active .roadmap-step:nth-child(4) .roadmap-dot{animation:flyUp 0.4s both;animation-delay:0.60s}',
    '.slide.active .roadmap-step:nth-child(5) .roadmap-dot{animation:flyUp 0.4s both;animation-delay:0.70s}',
    '.slide.active .roadmap-step:nth-child(6) .roadmap-dot{animation:flyUp 0.4s both;animation-delay:0.80s}',
    '.slide.active .roadmap-step:nth-child(7) .roadmap-dot{animation:flyUp 0.4s both;animation-delay:0.90s}',
    '.slide .ref-item{opacity:0}',
    '.slide.active .ref-item:nth-child(1){animation:flyUp 0.45s both;animation-delay:0.30s}',
    '.slide.active .ref-item:nth-child(2){animation:flyUp 0.45s both;animation-delay:0.42s}',
    '.slide.active .ref-item:nth-child(3){animation:flyUp 0.45s both;animation-delay:0.54s}',
    '.slide.active .ref-item:nth-child(4){animation:flyUp 0.45s both;animation-delay:0.66s}',
    '.slide .flow-node{opacity:0;transform:translateY(12px)}',
    '.slide.active .flow-node:nth-child(1){animation:flyUp 0.45s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.30s}',
    '.slide.active .flow-node:nth-child(3){animation:flyUp 0.45s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.42s}',
    '.slide.active .flow-node:nth-child(5){animation:flyUp 0.45s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.54s}',
    '@keyframes ringPulse{0%{box-shadow:0 0 0 0 rgba(37,99,235,0.5)}70%{box-shadow:0 0 0 10px rgba(37,99,235,0)}100%{box-shadow:0 0 0 0 rgba(37,99,235,0)}}',
    '.side-dots .dot.active{animation:ringPulse 2s infinite}',
    '.slide-visual img{transition:transform 0.4s cubic-bezier(0.16,1,0.3,1),box-shadow 0.4s ease;will-change:transform}',
    '.slide-visual img:hover{transform:scale(1.025) translateY(-5px);box-shadow:0 30px 60px rgba(37,99,235,0.14)}',
    '@keyframes floatDeep{0%{transform:translateY(0px) rotate(0deg)}33%{transform:translateY(-10px) rotate(0.3deg)}66%{transform:translateY(-5px) rotate(-0.2deg)}100%{transform:translateY(0px) rotate(0deg)}}',
    '.animate-float{animation:floatDeep 5s ease-in-out infinite}',
    '@keyframes titleGlow{0%,100%{text-shadow:0 0 0px rgba(37,99,235,0)}50%{text-shadow:0 4px 30px rgba(37,99,235,0.2)}}',
    '.thank-you-title{animation:titleGlow 3s ease-in-out infinite}',
    '.sol-card,.glass-card{position:relative;overflow:hidden}',
    '.sol-card::after,.glass-card::after{content:"";position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent);transform:skewX(-20deg);transition:left 0.6s ease;pointer-events:none}',
    '.sol-card:hover::after,.glass-card:hover::after{left:140%}',
    '@keyframes sparkleRing{0%{transform:translate(-50%,-50%) scale(0.85);opacity:0.6}100%{transform:translate(-50%,-50%) scale(1.9);opacity:0}}',
    '.cover-ring{position:absolute;border-radius:50%;border:1.5px solid rgba(37,99,235,0.22);animation:sparkleRing 4s ease-out infinite;pointer-events:none;top:50%;left:50%}',
    '.cover-ring:nth-child(1){width:220px;height:220px;animation-delay:0s}',
    '.cover-ring:nth-child(2){width:340px;height:340px;animation-delay:1.3s}',
    '.cover-ring:nth-child(3){width:460px;height:460px;animation-delay:2.6s}',
    '@keyframes fillBar{from{width:0%}to{width:100%}}',
    '.slide.active .progress-bar{animation:fillBar 1.6s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.6s}',
    '.slide.active .support-points li:nth-child(1){animation:flyUp 0.45s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.40s}',
    '.slide.active .support-points li:nth-child(2){animation:flyUp 0.45s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.50s}',
    '.slide.active .support-points li:nth-child(3){animation:flyUp 0.45s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.60s}',
    '.slide.active .support-points li:nth-child(4){animation:flyUp 0.45s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.70s}',
    '.slide.active .support-points li:nth-child(5){animation:flyUp 0.45s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.80s}',
    '.slide.active .support-points li:nth-child(6){animation:flyUp 0.45s cubic-bezier(0.16,1,0.3,1) both;animation-delay:0.90s}',
  ].join('\n');
  document.head.appendChild(style);
}

// ─── Particle Canvas System ─────────────────────────────────────
function initParticleCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.4 + 0.1
  }));

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(37,99,235,' + p.alpha + ')';
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(37,99,235,' + (0.06 * (1 - dist / 100)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ─── Cursor Glow Effect ─────────────────────────────────────────
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', function(e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ─── 3D Card Tilt on Hover ──────────────────────────────────────
function initCardTilt() {
  document.addEventListener('mousemove', function(e) {
    document.querySelectorAll('.sol-card, .glass-card').forEach(function(card) {
      const rect = card.getBoundingClientRect();
      if (rect.width === 0) return;
      const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      if (Math.hypot(dx, dy) < 1.5) {
        card.style.transform = 'perspective(600px) rotateY(' + (dx * 5) + 'deg) rotateX(' + (-dy * 5) + 'deg) translateY(-2px)';
        card.style.transition = 'transform 0.1s ease';
      } else {
        card.style.transform = '';
        card.style.transition = 'transform 0.4s ease';
      }
    });
  });
}

// ─── Cover Slide Sparkle Rings ──────────────────────────────────
function initCoverSparkleRings() {
  const coverSlide = slides[0];
  if (!coverSlide) return;
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('div');
    ring.className = 'cover-ring';
    coverSlide.appendChild(ring);
  }
}

// ─── Add Third Animated Orb ────────────────────────────────────
function addThirdOrb() {
  const container = document.querySelector('#presentation-viewport') || document.body;
  const orb = document.createElement('div');
  orb.className = 'ambient-glow bg-glow-3';
  container.insertBefore(orb, container.firstChild);
}

// ─── Bootstrap ─────────────────────────────────────────────────
function init() {
  showSlide(0);
  registerEventListeners();
  registerMockupListeners();
  registerPresentationModeController();
  injectAnimationStyles();
  initParticleCanvas();
  initCursorGlow();
  initCardTilt();
  initCoverSparkleRings();
  addThirdOrb();
}

window.addEventListener('DOMContentLoaded', init);
