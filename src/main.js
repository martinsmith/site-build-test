// ===== CSS Imports =====
import './css/base.css';
import './css/components.css';
import './css/home.css';

// ===== Utils =====
import {
  initAnimations,
  initFAQ,
  initAutoTabs,
  animateServicesSection,
  animateSectorsSection,
  animateFaqSection,
  animateCtaSection,
} from './utils.js';

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

// ===== Services tabbed section (auto-rotate + scroll sequence) =====
initAutoTabs(document.getElementById('services'));
animateServicesSection(document.getElementById('services'));

// ===== Sectors scroll sequence =====
animateSectorsSection(document.getElementById('sectors'));

// ===== FAQ accordion + scroll sequence =====
initFAQ();
animateFaqSection(document.getElementById('faq'));

// ===== CTA scroll sequence =====
animateCtaSection(document.getElementById('cta-partner'));

// ===== GSAP animations (hero + generic scroll) =====
initAnimations();
