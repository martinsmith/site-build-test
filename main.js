// Navbar scroll effect
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

// Animate stats on scroll
const observerOptions = {
  threshold: 0.3,
  rootMargin: '0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .stats-card, .sustain-card, .innovation-card, .project-side-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  animateOnScroll.observe(el);
});

// Add animate-in class styles dynamically
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// Stagger animation for grid items
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.querySelectorAll('.service-card, .stats-card, .sustain-card');
      children.forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
        child.classList.add('animate-in');
      });
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.services-grid, .stats-grid, .sustainability-grid').forEach(grid => {
  staggerObserver.observe(grid);
});

