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


