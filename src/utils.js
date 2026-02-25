// ===== IntersectionObserver for scroll animations =====
export function initScrollObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '-350px 0px 0px 0px' }
  );
  document.querySelectorAll('[data-observe]').forEach((el) => observer.observe(el));
}

// ===== FAQ Accordion =====
export function initFAQ() {
  document.querySelectorAll('.faq-list').forEach((list) => {
    const items = list.querySelectorAll('.faq-item');

    items.forEach((item) => {
      const trigger = item.querySelector('.faq-trigger');
      const answer = item.querySelector('.faq-answer');
      if (!trigger || !answer) return;

      // Set closed state
      answer.style.height = '0';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'height 0.35s ease';

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close all items in this list
        items.forEach((i) => {
          if (i.classList.contains('is-open')) {
            const a = i.querySelector('.faq-answer');
            const t = i.querySelector('.faq-trigger');
            i.classList.remove('is-open');
            if (t) t.classList.remove('active');
            if (a) {
              a.style.height = a.scrollHeight + 'px';
              requestAnimationFrame(() => {
                a.style.height = '0';
              });
            }
          }
        });

        // Open clicked item if it was closed
        if (!isOpen) {
          item.classList.add('is-open');
          trigger.classList.add('active');
          answer.style.height = answer.scrollHeight + 'px';
          answer.addEventListener(
            'transitionend',
            () => {
              if (item.classList.contains('is-open')) {
                answer.style.height = 'auto';
              }
            },
            { once: true }
          );
        }
      });
    });
  });
}

// ===== Tabbed Panels (simple, no auto-rotate) =====
export function initTabs(sectionEl) {
  if (!sectionEl) return;
  const tabs = sectionEl.querySelectorAll('.sc-tab');
  const panels = sectionEl.querySelectorAll('.sc-panel');

  function showPanel(index) {
    tabs.forEach((tab, i) => tab.classList.toggle('active', i === index));
    panels.forEach((panel, i) => {
      if (i === index) {
        panel.style.display = '';
        panel.classList.add('sc-enter', 'sc-enter-start', 'is-animating');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            panel.classList.remove('sc-enter-start');
            panel.classList.add('sc-enter-end');
          });
        });
      } else {
        panel.style.display = 'none';
        panel.classList.remove('is-animating', 'sc-enter', 'sc-enter-start', 'sc-enter-end');
      }
    });
  }

  showPanel(0);
  tabs.forEach((tab, i) => tab.addEventListener('click', () => showPanel(i)));
}

// ===== Tabbed Panels with Auto-rotate =====
export function initAutoTabs(sectionEl, intervalMs = 10000, initialDelayMs = 20000) {
  if (!sectionEl) return;
  const tabs = sectionEl.querySelectorAll('.sc-tab');
  const panels = sectionEl.querySelectorAll('.sc-panel');
  let active = 0;
  let timer = null;
  let delay = null;

  function showPanel(index) {
    tabs.forEach((tab, i) => tab.classList.toggle('active', i === index));
    panels.forEach((panel, i) => {
      if (i === index) {
        panel.style.display = '';
        panel.classList.add('sc-enter', 'sc-enter-start', 'is-animating');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            panel.classList.remove('sc-enter-start');
            panel.classList.add('sc-enter-end');
          });
        });
      } else {
        panel.style.display = 'none';
        panel.classList.remove('is-animating', 'sc-enter', 'sc-enter-start', 'sc-enter-end');
      }
    });
    active = index;
  }

  function start() {
    clearInterval(timer);
    timer = setInterval(() => showPanel((active + 1) % panels.length), intervalMs);
  }

  function pause() {
    clearInterval(timer);
    clearTimeout(delay);
    timer = null;
    delay = null;
  }

  function restart() {
    pause();
    delay = setTimeout(() => start(), initialDelayMs);
  }

  showPanel(0);
  delay = setTimeout(() => start(), initialDelayMs);
  tabs.forEach((tab, i) =>
    tab.addEventListener('click', () => {
      showPanel(i);
      restart();
    })
  );
}

