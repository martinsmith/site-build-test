// ===== CSS Imports =====
import './css/base.css';
import './css/components.css';
import './css/service.css';

// ===== Utils =====
import { initAnimations, initMobileNav, initFAQ } from './utils.js';

// ===== FOUC Prevention =====
document.body.classList.add('loaded');

// ===== Mobile nav =====
initMobileNav();

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

// ===== FAQ accordion =====
initFAQ();

// ===== GSAP animations (hero + scroll) =====
initAnimations();

// ===== Parallax scroll effect =====
const parallax = document.querySelector('.parallax-divider img');
if (parallax) {
  window.addEventListener('scroll', () => {
    const rect = parallax.parentElement.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (rect.bottom > 0 && rect.top < viewH) {
      const progress = (viewH - rect.top) / (viewH + rect.height);
      parallax.style.transform = `translateY(${(progress - 0.5) * 80}px)`;
    }
  }, { passive: true });
}

