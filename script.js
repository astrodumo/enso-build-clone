/* =====================================================
   ENSO.BUILD — CLONE JAVASCRIPT
   ===================================================== */

// === NAV: Sticky + Scroll Class ===
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// === NAV: Mobile Hamburger Toggle ===
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// === HERO: Word Rotator ===
const words = document.querySelectorAll('#wordRotator .word');
let currentWord = 0;

function rotateWord() {
  words[currentWord].classList.remove('active');
  words[currentWord].style.animation = '';

  currentWord = (currentWord + 1) % words.length;

  // Animate in
  words[currentWord].classList.add('active');
  words[currentWord].style.animation = 'wordIn 0.4s ease forwards';
}

// Inject the keyframe
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes wordIn {
    from { opacity: 0; transform: translateY(16px) skewY(2deg); }
    to   { opacity: 1; transform: translateY(0)   skewY(0); }
  }
  @keyframes wordOut {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(-12px); }
  }
  #wordRotator .word {
    display: none;
    animation: wordIn 0.4s ease forwards;
  }
  #wordRotator .word.active {
    display: block;
  }
`;
document.head.appendChild(styleTag);

setInterval(rotateWord, 1800);

// === LAUNCH: Step Tabs ===
const launchSteps = document.querySelectorAll('.launch__step');

launchSteps.forEach(step => {
  step.addEventListener('click', () => {
    launchSteps.forEach(s => s.classList.remove('active'));
    step.classList.add('active');
  });
});

// === CLIENTS: Tab Switcher ===
const clientTabs = document.querySelectorAll('.client-tab');

clientTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    clientTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// === SCROLL REVEAL: Fade-in sections ===
const revealTargets = document.querySelectorAll(
  '.shortcut-card, .network__step, .story__block, .template-big-card, .investor-item, .help-link, .action-row'
);

const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal-target {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .reveal-target.revealed {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(revealStyle);

revealTargets.forEach((el, i) => {
  el.classList.add('reveal-target');
  el.style.transitionDelay = `${(i % 4) * 0.07}s`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealTargets.forEach(el => revealObserver.observe(el));

// === STORY: Scroll-activated lines ===
const storyBlocks = document.querySelectorAll('.story__block');

const storyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }
    });
  },
  { threshold: 0.2 }
);

storyBlocks.forEach((block, i) => {
  block.style.opacity = '0';
  block.style.transform = 'translateX(-16px)';
  block.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  storyObserver.observe(block);
});

// === NETWORK STEPS: Staggered entrance ===
const networkSteps = document.querySelectorAll('.network__step');
const networkObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        networkSteps.forEach((step, i) => {
          setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
          }, i * 100);
        });
        networkObserver.disconnect();
      }
    });
  },
  { threshold: 0.2 }
);

networkSteps.forEach(step => {
  step.style.opacity = '0';
  step.style.transform = 'translateY(20px)';
  step.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
});

if (networkSteps.length) {
  networkObserver.observe(networkSteps[0]);
}

// === STATS: Count-up animation ===
const stats = [
  { el: null, target: 100, suffix: '+', label: 'apps' },
  { el: null, target: 250, suffix: '+', label: 'protocols' },
  { el: null, target: 1900, suffix: '', label: 'developers' },
];

const statEls = document.querySelectorAll('.hero__stat-number');
statEls.forEach((el, i) => {
  if (stats[i]) stats[i].el = el;
});

let statsAnimated = false;

function animateCount(el, target, suffix, duration = 1200) {
  const start = performance.now();
  const startVal = 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        stats.forEach(({ el, target, suffix }) => {
          if (el) animateCount(el, target, suffix);
        });
        heroObserver.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.querySelector('.hero__stats');
if (heroStats) heroObserver.observe(heroStats);
