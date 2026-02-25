import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ---- Shared config ----
const EASE = 'expo.out';
const SCROLL_START = 'top bottom';
const SCROLL_DURATION = 1.2;
const STAGGER = 0.18;

// ---- Hero (above-fold, load-time) ----
function animateHero() {
  const all = [...document.querySelectorAll('.hero-anim')];
  if (!all.length) return;

  const title   = all.find(el => el.tagName === 'H1');
  const sub     = all.find(el => el.tagName === 'P');
  const ctasEl  = all.find(el => /ctas/i.test(el.className));
  const buttons = ctasEl ? [...ctasEl.querySelectorAll('.btn')] : [];
  const badge   = all.find(el => el.classList.contains('section-tag-dark') || el.classList.contains('hero-badge'));
  const img     = all.find(el => /hero-img/.test(el.className));

  // Set initial states for each targeted element
  if (title)  gsap.set(title,   { opacity: 0, x: 30,  y: 20 });
  if (sub)    gsap.set(sub,     { opacity: 0, y: 30 });
  if (buttons.length) gsap.set(buttons, { opacity: 0, y: 25 });
  else if (ctasEl)    gsap.set(ctasEl,  { opacity: 0, y: 25 });
  if (badge)  gsap.set(badge,   { opacity: 0, y: 20 });
  if (img)    gsap.set(img,     { opacity: 0, y: 40 });

  // Wrapper divs with hero-anim (not directly targeted) → visible immediately
  const targeted = [title, sub, ctasEl, badge, img].filter(Boolean);
  all.filter(el => !targeted.includes(el)).forEach(el => gsap.set(el, { opacity: 1 }));

  const tl = gsap.timeline({ defaults: { ease: EASE, clearProps: 'all' } });
  if (title)  tl.to(title,   { opacity: 1, x: 0, y: 0, duration: 1.1 });
  if (sub)    tl.to(sub,     { opacity: 1, y: 0,        duration: 0.9 }, '-=0.65');
  if (buttons.length) tl.to(buttons, { opacity: 1, y: 0, duration: 0.7, stagger: 0.13 }, '-=0.55');
  else if (ctasEl)    tl.to(ctasEl,  { opacity: 1, y: 0, duration: 0.7 },                '-=0.55');
  if (img)    tl.to(img,     { opacity: 1, y: 0,        duration: 1.0 }, '<');
  if (badge)  tl.to(badge,   { opacity: 1, y: 0,        duration: 0.7 }, '-=0.35');
}

// ---- Scroll animations (shared core) ----
// Each element gets its own trigger point via ScrollTrigger.batch().
// Elements that enter the viewport within the same interval are grouped
// and staggered together — matching the per-element Webflow IX2 approach.
function scrollFrom(targets, fromVars) {
  if (!targets.length) return;
  gsap.set(targets, { opacity: 0, ...fromVars });
  ScrollTrigger.batch(targets, {
    start: SCROLL_START,
    once: true,
    onEnter: (batch) => gsap.to(batch, {
      opacity: 1, y: 0, x: 0,
      duration: SCROLL_DURATION, ease: EASE, stagger: STAGGER, clearProps: 'all',
    }),
  });
}

function animateOnScroll() {
  document.querySelectorAll('[data-observe]').forEach((section) => {
    scrollFrom([...section.querySelectorAll('.anim-fade-up')],    { y: 40 });
    scrollFrom([...section.querySelectorAll('.anim-slide-left')], { x: -50 });
    scrollFrom([...section.querySelectorAll('.anim-slide-right')],{ x: 50 });
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



// ---- Services section (index.html) ----
export function animateServicesSection(sectionEl) {
  if (!sectionEl) return;
  const title = sectionEl.querySelector('.sc-header .section-heading');
  const tag   = sectionEl.querySelector('.sc-header .section-tag-light, .sc-header .section-tag-dark');
  const tabs  = [...sectionEl.querySelectorAll('.sc-tab')];

  if (title) gsap.set(title, { opacity: 0, x: 30, y: 20 });
  if (tag)   gsap.set(tag,   { opacity: 0, y: 20 });
  if (tabs.length) gsap.set(tabs, { opacity: 0, y: 30 });

  ScrollTrigger.create({
    trigger: sectionEl, start: SCROLL_START, once: true,
    onEnter: () => {
      const tl = gsap.timeline({ defaults: { ease: EASE, clearProps: 'all' } });
      if (title)       tl.to(title, { opacity: 1, x: 0, y: 0, duration: 1.0 });
      if (tabs.length) tl.to(tabs,  { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, '-=0.5');
      if (tag)         tl.to(tag,   { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
    },
  });
}

// ---- Sectors section (index.html) ----
export function animateSectorsSection(sectionEl) {
  if (!sectionEl) return;
  const header   = sectionEl.querySelector('.sectors-header');
  const title    = header?.querySelector('.section-heading');
  const tag      = header?.querySelector('.section-tag-dark');
  const viewMore = header?.querySelector('.btn');
  const layout   = sectionEl.querySelector('.sectors-layout');
  const main     = layout?.querySelector('.sector-main');
  const cards    = [...(layout?.querySelectorAll('.sector-card') ?? [])];

  if (title)         gsap.set(title,    { opacity: 0, x: 30, y: 20 });
  if (tag)           gsap.set(tag,      { opacity: 0, y: 20 });
  if (viewMore)      gsap.set(viewMore, { opacity: 0, y: 20 });
  if (main)          gsap.set(main,     { opacity: 0, y: 40 });
  if (cards.length)  gsap.set(cards,    { opacity: 0, y: 35 });

  // Trigger 1: header row — title then tag + view-more fade last
  if (header) ScrollTrigger.create({
    trigger: header, start: SCROLL_START, once: true,
    onEnter: () => {
      const tl = gsap.timeline({ defaults: { ease: EASE, clearProps: 'all' } });
      if (title) tl.to(title, { opacity: 1, x: 0, y: 0, duration: 1.0 });
      const last = [tag, viewMore].filter(Boolean);
      if (last.length) tl.to(last, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, '-=0.3');
    },
  });

  // Trigger 2: layout — sector-main then cards cascade (slower stagger)
  if (layout) ScrollTrigger.create({
    trigger: layout, start: SCROLL_START, once: true,
    onEnter: () => {
      const tl = gsap.timeline({ defaults: { ease: EASE, clearProps: 'all' } });
      if (main)         tl.to(main,  { opacity: 1, y: 0, duration: 1.0 });
      if (cards.length) tl.to(cards, { opacity: 1, y: 0, duration: 1.0, stagger: 0.22 }, '-=0.5');
    },
  });
}

// ---- FAQ section (index.html + reusable) ----
export function animateFaqSection(sectionEl) {
  if (!sectionEl) return;
  const layout = sectionEl.querySelector('.faq-layout') || sectionEl;
  const title  = layout.querySelector('.section-heading');
  const tag    = layout.querySelector('.section-tag-light, .section-tag-dark');
  const sub    = layout.querySelector('.faq-header p');
  const items  = [...layout.querySelectorAll('.faq-item')];
  const img    = layout.querySelector('.faq-img');

  if (title)        gsap.set(title, { opacity: 0, x: 30, y: 20 });
  if (tag)          gsap.set(tag,   { opacity: 0, y: 20 });
  if (sub)          gsap.set(sub,   { opacity: 0, y: 20 });
  if (items.length) gsap.set(items, { opacity: 0, x: 50 });
  if (img)          gsap.set(img,   { opacity: 0, y: 30 });

  ScrollTrigger.create({
    trigger: layout, start: SCROLL_START, once: true,
    onEnter: () => {
      const tl = gsap.timeline({ defaults: { ease: EASE, clearProps: 'all' } });
      if (title)        tl.to(title, { opacity: 1, x: 0, y: 0, duration: 1.0 });
      if (sub)          tl.to(sub,   { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
      if (tag)          tl.to(tag,   { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
      if (items.length) tl.to(items, { opacity: 1, x: 0, duration: 0.7, stagger: 0.12 }, '-=0.3');
      if (img)          tl.to(img,   { opacity: 1, y: 0, duration: 0.9 }, '<');
    },
  });
}

// ---- CTA partner section (index.html) ----
export function animateCtaSection(sectionEl) {
  if (!sectionEl) return;
  const inner  = sectionEl.querySelector('.cta-partner-inner') || sectionEl;
  const img    = inner.querySelector('.cta-partner-img');
  const textEl = inner.querySelector('.cta-partner-text');
  const title  = textEl?.querySelector('h2');
  const para   = textEl?.querySelector('p');
  const tag    = textEl?.querySelector('.section-tag-dark, .section-tag-light');
  const btn    = textEl?.querySelector('.btn');

  if (img)   gsap.set(img,   { opacity: 0, x: -50 });
  if (title) gsap.set(title, { opacity: 0, x: 30, y: 20 });
  if (para)  gsap.set(para,  { opacity: 0, y: 20 });
  if (tag)   gsap.set(tag,   { opacity: 0, y: 20 });
  if (btn)   gsap.set(btn,   { opacity: 0, y: 20 });

  ScrollTrigger.create({
    trigger: inner, start: SCROLL_START, once: true,
    onEnter: () => {
      const tl = gsap.timeline({ defaults: { ease: EASE, clearProps: 'all' } });
      if (img)   tl.to(img,   { opacity: 1, x: 0, duration: 1.0 });
      if (title) tl.to(title, { opacity: 1, x: 0, y: 0, duration: 1.0 }, '<');
      if (para)  tl.to(para,  { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
      const last = [tag, btn].filter(Boolean);
      if (last.length) tl.to(last, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, '-=0.3');
    },
  });
}


// ---- Mobile nav drawer ----
export function initMobileNav() {
  const toggle   = document.getElementById('mobileToggle');
  const nav      = document.getElementById('mobileNav');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const closeBtn = document.getElementById('mobileNavClose');
  if (!toggle || !nav || !backdrop) return;

  const bars = [...toggle.querySelectorAll('span')];

  function open() {
    nav.style.visibility = 'visible';
    nav.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    backdrop.style.pointerEvents = 'auto';
    gsap.to(nav,      { x: 0,     duration: 0.4, ease: 'power3.out' });
    gsap.to(backdrop, { opacity: 1, duration: 0.3 });
    gsap.to(bars[0],  { y: 7,  rotation: 45,  duration: 0.3 });
    gsap.to(bars[1],  { opacity: 0,            duration: 0.2 });
    gsap.to(bars[2],  { y: -7, rotation: -45, duration: 0.3 });
    document.body.style.overflow = 'hidden';
  }

  function close() {
    backdrop.style.pointerEvents = 'none';
    toggle.setAttribute('aria-expanded', 'false');
    gsap.to(nav,      { x: '100%', duration: 0.35, ease: 'power3.in',
                        onComplete: () => { nav.style.visibility = 'hidden'; nav.setAttribute('aria-hidden', 'true'); } });
    gsap.to(backdrop, { opacity: 0, duration: 0.3 });
    gsap.to(bars[0],  { y: 0, rotation: 0,  duration: 0.3 });
    gsap.to(bars[1],  { opacity: 1,          duration: 0.2 });
    gsap.to(bars[2],  { y: 0, rotation: 0,  duration: 0.3 });
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Sub-menu accordions inside the drawer
  nav.querySelectorAll('.mobile-nav-accordion').forEach(btn => {
    const sub = btn.closest('.mobile-nav-group')?.querySelector('.mobile-nav-sub');
    if (!sub) return;
    gsap.set(sub, { height: 0, overflow: 'hidden' });
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('is-open');
      nav.querySelectorAll('.mobile-nav-accordion.is-open').forEach(b => {
        b.classList.remove('is-open');
        const s = b.closest('.mobile-nav-group')?.querySelector('.mobile-nav-sub');
        if (s) gsap.to(s, { height: 0, duration: 0.3, ease: 'power2.inOut' });
      });
      if (!isOpen) {
        btn.classList.add('is-open');
        gsap.to(sub, { height: 'auto', duration: 0.3, ease: 'power2.inOut' });
      }
    });
  });
}
