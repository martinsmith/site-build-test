// ===== CSS Imports =====
import './css/base.css';
import './css/components.css';
import './css/home.css';

// ===== Utils =====
import { initAnimations, initFAQ, initAutoTabs } from './utils.js';

// ===== FOUC Prevention =====
document.body.classList.add('loaded');

// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');
const topbar = document.getElementById('topbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
    if (topbar) topbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.classList.remove('scrolled');
    if (topbar) topbar.style.transform = 'translateY(0)';
  }
});

if (topbar) topbar.style.transition = 'transform 0.3s ease';

// ===== Back to top =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Services tabbed section (auto-rotate) =====
initAutoTabs(document.getElementById('services'));

// ===== FAQ accordion =====
initFAQ();

// ===== GSAP animations (hero + scroll) =====
initAnimations();
