/* ============ WHATSAPP SERVICE MODAL ============ */
(function () {
  const WA_NUMBER = '15715075663';

  const SERVICES = [
    'Microblading',
    'Ombre Powder Brows',
    'Nail Services',
    'Haircut & Styling',
    'Braiding Services',
    'Hair Color Services',
    'Hair Extensions',
    'Professional Makeup',
    'Eyelash Extensions',
    'Bridal Package',
    'Not Sure Yet / General Question'
  ];

  // Inject modal markup once the DOM is ready
  function injectModal() {
    const overlay = document.createElement('div');
    overlay.className = 'wa-modal-overlay';
    overlay.id = 'waModalOverlay';
    overlay.innerHTML = `
      <div class="wa-modal" role="dialog" aria-modal="true" aria-labelledby="waModalTitle">
        <button class="wa-modal-close" id="waModalClose" aria-label="Close">&times;</button>
        <h3 id="waModalTitle">What can we help you with?</h3>
        <p>Pick a service and we'll open WhatsApp with your message ready to send.</p>
        <div class="wa-service-grid" id="waServiceGrid"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const grid = overlay.querySelector('#waServiceGrid');
    SERVICES.forEach(service => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wa-service-btn';
      btn.dataset.service = service;
      btn.textContent = service;
      grid.appendChild(btn);
    });

    return overlay;
  }

  function openWhatsApp(service) {
    const msg = service === 'Not Sure Yet / General Question'
      ? "Hello, I'd like to ask about your services."
      : `Hello, I'd like to book an appointment for ${service}.`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener');
  }

  document.addEventListener('DOMContentLoaded', function () {
    const overlay = injectModal();
    const grid = overlay.querySelector('#waServiceGrid');
    const closeBtn = overlay.querySelector('#waModalClose');
    let lastFocused = null;

    function openModal(suggested) {
      lastFocused = document.activeElement;
      grid.querySelectorAll('.wa-service-btn').forEach(btn => {
        btn.classList.toggle('suggested', suggested && btn.dataset.service === suggested);
      });
      overlay.classList.add('open');
      closeBtn.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    // Intercept every WhatsApp link on the page (except the booking form's JS-built one, which has no static href)
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(link.dataset.service || null);
      });
    });

    grid.addEventListener('click', function (e) {
      const btn = e.target.closest('.wa-service-btn');
      if (!btn) return;
      closeModal();
      openWhatsApp(btn.dataset.service);
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });
  });
})();
