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

  function injectModal() {
    const overlay = document.createElement('div');
    overlay.className = 'wa-modal-overlay';
    overlay.id = 'waModalOverlay';
    overlay.innerHTML = `
      <div class="wa-modal" role="dialog" aria-modal="true" aria-labelledby="waModalTitle">
        <button class="wa-modal-close" id="waModalClose" aria-label="Close">&times;</button>

        <div class="wa-modal-step" id="waStepService">
          <h3 id="waModalTitle">What can we help you with?</h3>
          <p>Pick a service and we'll grab a couple details before sending your message.</p>
          <div class="wa-service-grid" id="waServiceGrid"></div>
        </div>

        <div class="wa-modal-step" id="waStepDetails" hidden>
          <button type="button" class="wa-modal-back" id="waModalBack"><i class="fa-solid fa-arrow-left"></i> Back</button>
          <h3>Almost there</h3>
          <p id="waSelectedServiceLabel"></p>
          <div class="form-row">
            <label for="waName">Full Name</label>
            <input type="text" id="waName" placeholder="Your name">
          </div>
          <div class="form-row">
            <label for="waDate">Preferred Date <span style="text-transform:none;font-weight:400;color:#8a8474;">(optional)</span></label>
            <input type="date" id="waDate">
          </div>
          <button type="button" class="btn btn-gold wa-send-btn" id="waSendBtn"><i class="fa-brands fa-whatsapp"></i> Send via WhatsApp</button>
        </div>
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

  function buildMessage(service, name, date) {
    const lines = ["Hello, I'd like to book an appointment.", ""];
    lines.push(`Service: ${service}`);
    if (name && name.trim()) lines.push(`Name: ${name.trim()}`);
    if (date) lines.push(`Preferred Date: ${date}`);
    lines.push("", "Thank you.");
    return lines.join('\n');
  }

  function openWhatsApp(service, name, date) {
    const msg = service === 'Not Sure Yet / General Question' && !name && !date
      ? "Hello, I'd like to ask about your services."
      : buildMessage(service, name, date);
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener');
  }

  document.addEventListener('DOMContentLoaded', function () {
    const overlay = injectModal();
    const grid = overlay.querySelector('#waServiceGrid');
    const closeBtn = overlay.querySelector('#waModalClose');
    const backBtn = overlay.querySelector('#waModalBack');
    const stepService = overlay.querySelector('#waStepService');
    const stepDetails = overlay.querySelector('#waStepDetails');
    const selectedLabel = overlay.querySelector('#waSelectedServiceLabel');
    const nameInput = overlay.querySelector('#waName');
    const dateInput = overlay.querySelector('#waDate');
    const sendBtn = overlay.querySelector('#waSendBtn');

    let selectedService = null;
    let lastFocused = null;

    function showServiceStep(suggested) {
      grid.querySelectorAll('.wa-service-btn').forEach(btn => {
        btn.classList.toggle('suggested', suggested && btn.dataset.service === suggested);
      });
      stepDetails.hidden = true;
      stepService.hidden = false;
    }

    function showDetailsStep(service) {
      selectedService = service;
      selectedLabel.textContent = service;
      stepService.hidden = true;
      stepDetails.hidden = false;
      nameInput.focus();
    }

    function openModal(suggested) {
      lastFocused = document.activeElement;
      nameInput.value = '';
      dateInput.value = '';
      showServiceStep(suggested);
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(link.dataset.service || null);
      });
    });

    grid.addEventListener('click', function (e) {
      const btn = e.target.closest('.wa-service-btn');
      if (!btn) return;
      showDetailsStep(btn.dataset.service);
    });

    backBtn.addEventListener('click', function () {
      showServiceStep(selectedService);
    });

    sendBtn.addEventListener('click', function () {
      closeModal();
      openWhatsApp(selectedService, nameInput.value, dateInput.value);
    });

    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); sendBtn.click(); }
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
