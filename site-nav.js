// Sticky header
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile nav
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function closeMobileNav(){
  navLinks.classList.remove('open');
  burger.classList.remove('open');
  navOverlay.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open menu');
}
function toggleMobileNav(){
  const isOpen = navLinks.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  navOverlay.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', toggleMobileNav);
navOverlay.addEventListener('click', closeMobileNav);
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));
