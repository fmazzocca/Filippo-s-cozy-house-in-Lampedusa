// Filippo's Cozy House — site script

const SUPPORTED_LANGS = ['it', 'en'];
const STORAGE_KEY = 'fch-lang';

function getLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  return 'it';
}

function applyLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  document.documentElement.lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);

  document.querySelectorAll('[data-it][data-en]').forEach((el) => {
    el.textContent = el.dataset[lang];
  });

  document.querySelectorAll('[data-it-aria][data-en-aria]').forEach((el) => {
    el.setAttribute('aria-label', el.dataset[lang + 'Aria']);
  });

  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.classList.toggle('font-semibold', btn.dataset.langBtn === lang);
    btn.classList.toggle('text-corallo', btn.dataset.langBtn === lang);
    btn.setAttribute('aria-pressed', String(btn.dataset.langBtn === lang));
  });
}

function initLangSwitcher() {
  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => applyLang(btn.dataset.langBtn));
  });
  applyLang(getLang());
}

function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length || !window.Motion) return;

  const { animate, inView } = window.Motion;

  els.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    inView(el, () => {
      animate(
        el,
        { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0)'] },
        { duration: 0.8, easing: 'ease-out' }
      );
    }, { margin: '-10% 0px -10% 0px' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLangSwitcher();
  initScrollReveal();
});
