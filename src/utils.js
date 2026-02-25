import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ---- Shared config ----
const EASE = 'expo.out';
const SCROLL_START = 'top 40%';
const SCROLL_DURATION = 1.2;
const STAGGER = 0.18;

// ---- Hero (above-fold, load-time) ----
function animateHero() {
  const els = gsap.utils.toArray('.hero-anim');
  if (!els.length) return;
  gsap.from(els, { opacity: 0, y: 30, duration: 0.8, stagger: 0.15, ease: EASE, clearProps: 'all' });
}

// ---- Scroll animations (shared core) ----
function scrollFrom(targets, fromVars, trigger) {
  if (!targets.length) return;
  gsap.from(targets, {
    opacity: 0, duration: SCROLL_DURATION, ease: EASE, stagger: STAGGER, clearProps: 'all',
    ...fromVars,
    scrollTrigger: { trigger, start: SCROLL_START, once: true },
  });
}

function animateOnScroll() {
  document.querySelectorAll('[data-observe]').forEach((section) => {
    scrollFrom([...section.querySelectorAll('.anim-fade-up')],    { y: 40 },  section);
    scrollFrom([...section.querySelectorAll('.anim-slide-left')], { x: -50 }, section);
    scrollFrom([...section.querySelectorAll('.anim-slide-right')],{ x: 50 },  section);
  });
}

// ---- Public init called by every page ----
export function initAnimations() {
  animateHero();
  animateOnScroll();
}

// ---- Tab panel transition (internal) ----
function animatePanel(panel) {
  const body      = panel.querySelector('.sc-panel-body');
  const heading   = body?.querySelector('h3');
  const para      = body?.querySelector('p');
  const listItems = body ? [...body.querySelectorAll('.check-list li')] : [];
  const cta       = body?.querySelector('.sc-cta');

  gsap.killTweensOf([panel, heading, para, ...listItems, cta].filter(Boolean));

  gsap.fromTo(panel, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });

  const fadeEls = [heading, para, cta].filter(Boolean);
  if (fadeEls.length) {
    gsap.from(fadeEls, { opacity: 0, y: 10, duration: 0.5, ease: EASE, stagger: 0.12, delay: 0.15 });
  }
  if (listItems.length) {
    gsap.from(listItems, { opacity: 0, x: 20, duration: 0.4, ease: EASE, stagger: 0.08, delay: 0.4 });
  }
}

// ---- Tabbed panels (simple) ----
export function initTabs(sectionEl) {
  if (!sectionEl) return;
  const tabs   = [...sectionEl.querySelectorAll('.sc-tab')];
  const panels = [...sectionEl.querySelectorAll('.sc-panel')];

  function showPanel(index) {
    tabs.forEach((tab, i) => tab.classList.toggle('active', i === index));
    panels.forEach((panel, i) => {
      if (i === index) { gsap.set(panel, { display: '' }); animatePanel(panel); }
      else gsap.set(panel, { display: 'none' });
    });
  }

  showPanel(0);
  tabs.forEach((tab, i) => tab.addEventListener('click', () => showPanel(i)));
}

// ---- Tabbed panels with auto-rotate ----
export function initAutoTabs(sectionEl, intervalMs = 10000, initialDelayMs = 20000) {
  if (!sectionEl) return;
  const tabs   = [...sectionEl.querySelectorAll('.sc-tab')];
  const panels = [...sectionEl.querySelectorAll('.sc-panel')];
  let active = 0, timer = null, delay = null;

  function showPanel(index) {
    tabs.forEach((tab, i) => tab.classList.toggle('active', i === index));
    panels.forEach((panel, i) => {
      if (i === index) { gsap.set(panel, { display: '' }); animatePanel(panel); }
      else gsap.set(panel, { display: 'none' });
    });
    active = index;
  }

  const start   = () => { clearInterval(timer); timer = setInterval(() => showPanel((active + 1) % panels.length), intervalMs); };
  const pause   = () => { clearInterval(timer); clearTimeout(delay); timer = null; delay = null; };
  const restart = () => { pause(); delay = setTimeout(start, initialDelayMs); };

  showPanel(0);
  delay = setTimeout(start, initialDelayMs);
  tabs.forEach((tab, i) => tab.addEventListener('click', () => { showPanel(i); restart(); }));
}

// ---- FAQ accordion ----
export function initFAQ() {
  document.querySelectorAll('.faq-list').forEach((list) => {
    const items = [...list.querySelectorAll('.faq-item')];

    items.forEach((item) => {
      const trigger = item.querySelector('.faq-trigger');
      const answer  = item.querySelector('.faq-answer');
      if (!trigger || !answer) return;

      gsap.set(answer, { height: 0, overflow: 'hidden' });

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        items.forEach((i) => {
          if (i.classList.contains('is-open')) {
            i.classList.remove('is-open');
            i.querySelector('.faq-trigger')?.classList.remove('active');
            gsap.to(i.querySelector('.faq-answer'), { height: 0, duration: 0.35, ease: 'power2.inOut' });
          }
        });

        if (!isOpen) {
          item.classList.add('is-open');
          trigger.classList.add('active');
          gsap.to(answer, { height: 'auto', duration: 0.35, ease: 'power2.inOut' });
        }
      });
    });
  });
}

