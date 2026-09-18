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