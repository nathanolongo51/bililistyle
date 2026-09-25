/* Force HTTPS (except localhost) */
(function () {
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    location.replace('https:' + window.location.href.substring(window.location.protocol.length));
  }
})();

/* Page loader */
(function () {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  function hideLoader() {
    loader.classList.add('is-hidden');
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 2500);
  }
})();

/* Burger menu */
const burger = document.getElementById('burger');
const nav = document.getElementById('mainNav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
    document.body.classList.toggle('menu-open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('is-open');
      nav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    });
  });
}

/* ================= ENVOI DU FORMULAIRE VIA WHATSAPP ================= */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const WHATSAPP_NUMBER = '243840811313'; // numéro sans + ni espaces

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Anti-spam honeypot
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== '') {
      return false;
    }

    const name = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#telephone').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !phone || !message) {
      showFeedback('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    const text =
`Bonjour, je m'appelle ${name}, mon numéro est le ${phone}, je vous contacte depuis votre site web.

${message}`;

    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    window.open(whatsappURL, '_blank');

    showFeedback('Redirection vers WhatsApp…', 'success');
  });

  function showFeedback(msg, type) {
    const feedback = document.getElementById('form-feedback');
    if (!feedback) return;

    feedback.hidden = false;
    feedback.textContent = msg;
    feedback.className = 'form-feedback ' + type;

    setTimeout(() => {
      feedback.hidden = true;
    }, 4000);
  }
})();
/* ================= COOKIE CONSENT ================= */
(function () {
  const BANNER_ID = 'cookie-banner';
  const STORAGE_KEY = 'bililistyle_cookie_consent';

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function hideBanner() {
    const banner = document.getElementById(BANNER_ID);
    if (banner) banner.hidden = true;
  }

  function showBanner() {
    const banner = document.getElementById(BANNER_ID);
    if (banner) banner.hidden = false;
  }

  function updateStatusText(value) {
    const el = document.getElementById('cookie-status');
    if (!el) return;
    if (value === 'accepted') el.textContent = 'Vous avez accepté les cookies.';
    else if (value === 'refused') el.textContent = 'Vous avez refusé les cookies non essentiels.';
    else el.textContent = 'Aucun choix enregistré pour le moment.';
  }

  const consent = getConsent();
  if (!consent) {
    showBanner();
  } else {
    hideBanner();
  }
  updateStatusText(consent);

  function bind(id, value) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', function () {
      setConsent(value);
      hideBanner();
      updateStatusText(value);
    });
  }

  bind('cookie-accept', 'accepted');
  bind('cookie-refuse', 'refused');
  bind('cookie-accept-page', 'accepted');
  bind('cookie-refuse-page', 'refused');
})();
/* ================= CARROUSEL + LIGHTBOX ================= */
(function () {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsWrap = document.getElementById('carouselDots');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  if (!slides.length) return;

  let index = 0;
  let lbIndex = 0;
  let autoTimer = null;
  const AUTO_MS = 4000;

  function slidesPerView() {
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, slides.length - slidesPerView());
  }

  function goTo(i, loop) {
    const max = maxIndex();
    if (loop) {
      index = i > max ? 0 : (i < 0 ? max : i);
    } else {
      index = Math.max(0, Math.min(i, max));
    }
    const slideW = slides[0].getBoundingClientRect().width;
    const gap = 12;
    track.style.transform = 'translateX(' + (-index * (slideW + gap)) + 'px)';
    updateDots();
  }

  function updateDots() {
    if (!dotsWrap) return;
    const pages = maxIndex() + 1;
    dotsWrap.innerHTML = '';
    for (let p = 0; p < pages; p++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel-dot' + (p === index ? ' is-active' : '');
      b.setAttribute('aria-label', 'Page ' + (p + 1));
      b.addEventListener('click', function () {
        goTo(p);
        restartAuto();
      });
      dotsWrap.appendChild(b);
    }
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function startAuto() {
    stopAuto();
    if (maxIndex() < 1) return;
    autoTimer = setInterval(function () {
      if (lightbox && !lightbox.hidden) return;
      goTo(index + 1, true);
    }, AUTO_MS);
  }

  function restartAuto() {
    stopAuto();
    startAuto();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goTo(index - 1, true);
      restartAuto();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goTo(index + 1, true);
      restartAuto();
    });
  }

  window.addEventListener('resize', function () {
    goTo(index);
    restartAuto();
  });

  const carouselRoot = document.getElementById('photoCarousel');
  if (carouselRoot) {
    carouselRoot.addEventListener('mouseenter', stopAuto);
    carouselRoot.addEventListener('mouseleave', startAuto);
    carouselRoot.addEventListener('focusin', stopAuto);
    carouselRoot.addEventListener('focusout', startAuto);
  }

  function openLightbox(i) {
    lbIndex = i;
    const slide = slides[lbIndex];
    if (!slide || !lightbox) return;
    stopAuto();
    lightboxImg.src = slide.getAttribute('data-full') || slide.querySelector('img').src;
    lightboxImg.alt = slide.querySelector('img').alt || '';
    if (lightboxCaption) lightboxCaption.textContent = slide.getAttribute('data-caption') || '';
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.classList.remove('lightbox-open');
    startAuto();
  }

  function lbNav(dir) {
    lbIndex = (lbIndex + dir + slides.length) % slides.length;
    openLightbox(lbIndex);
  }

  slides.forEach(function (slide, i) {
    slide.addEventListener('click', function () { openLightbox(i); });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function () { lbNav(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function () { lbNav(1); });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (lightbox && !lightbox.hidden) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbNav(-1);
      if (e.key === 'ArrowRight') lbNav(1);
    }
  });

  goTo(0);
  startAuto();
})();

