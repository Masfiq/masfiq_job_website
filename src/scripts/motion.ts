/**
 * Page animations with anime.js.
 *
 * Progressive enhancement: an inline script in Base.astro adds `motion` to <html>
 * only when the visitor has not asked for reduced motion. CSS hides elements
 * marked with data attributes only while that class is present, and a safety
 * timer removes it if this file never runs, so content is never stuck hidden.
 *
 * Markers:
 *   data-hero          hero element that fades up on load
 *   data-hero-title    hero name, letters rise one by one
 *   data-hero-soft     hero summary, fades up
 *   data-split         heading whose words rise when its section appears
 *   data-pipeline      hero diagram, draws step by step
 *   data-count="N"     number that counts up from 0 to N
 *   data-reveal        element that fades up when scrolled into view
 *   data-reveal-group  container whose children fade up one after another
 *   data-stagger       container whose children pop in after their card appears
 *   data-blob          background light that drifts slowly
 *   data-dotgrid       grid of dots that ripples on click and every few seconds
 *   data-timeline      experience list whose colored line fills as you scroll
 */
import { animate, createDraggable, createSpring, createTimeline, onScroll, splitText, stagger, utils } from 'animejs';

type Targets = HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>;
type Params = NonNullable<Parameters<typeof animate>[1]>;

const root = document.documentElement;
(window as unknown as { __motion: boolean }).__motion = true;

const $ = <T extends HTMLElement = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(sel));

type Delay = number | ((el: HTMLElement, i: number, total: number) => number);

/**
 * Animate each target from `from` to its natural style. The element keeps its
 * CSS hidden state until its own animation begins (then gets `is-in`), and its
 * inline styles are removed when it finishes so hover effects work normally.
 */
function show(
  targets: Targets,
  from: Record<string, number>,
  { delay = 0, ...params }: Omit<Partial<Params>, 'delay'> & { delay?: Delay } = {},
) {
  const els = targets instanceof HTMLElement ? [targets] : Array.from(targets);
  const tweens: Record<string, [number, number]> = {};
  for (const [key, value] of Object.entries(from)) {
    tweens[key] = [value, key === 'opacity' || key.startsWith('scale') ? 1 : 0];
  }
  els.forEach((el, i) => {
    animate(el, {
      ...tweens,
      duration: 700,
      ease: 'outExpo',
      ...params,
      delay: typeof delay === 'function' ? delay(el, i, els.length) : delay,
      onBegin: () => el.classList.add('is-in'),
      onComplete: (self) => utils.cleanInlineStyles(self),
    } as Params);
  });
}

function countUp(el: HTMLElement, delay: number) {
  const target = Number(el.dataset.count);
  const decimals = Number(el.dataset.decimals ?? 0);
  if (!Number.isFinite(target)) return;
  const format = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const counter = { value: 0 };
  el.textContent = format(0);
  animate(counter, {
    value: target,
    delay,
    duration: 1400,
    ease: 'outExpo',
    modifier: utils.round(decimals),
    onUpdate: () => {
      el.textContent = format(counter.value);
    },
  });
}

/** Letters of the hero name rise one by one. Each letter carries its slice of the name's gradient. */
function heroName() {
  const title = document.querySelector<HTMLElement>('[data-hero-title]');
  if (!title) return;
  const gradient = getComputedStyle(title).backgroundImage;

  const split = splitText(title, { chars: { wrap: 'clip' } });
  split.addEffect(({ chars }) => {
    const box = title.getBoundingClientRect();
    for (const ch of chars as HTMLElement[]) {
      const r = ch.getBoundingClientRect();
      Object.assign(ch.style, {
        backgroundImage: gradient,
        backgroundSize: `${box.width * 2}px ${box.height}px`,
        backgroundPosition: `${box.left - r.left}px ${box.top - r.top}px`,
        webkitBackgroundClip: 'text',
        backgroundClip: 'text',
        webkitTextFillColor: 'transparent',
      });
    }
    title.classList.add('is-in');
    return animate(chars, {
      translateY: ['105%', '0%'],
      rotate: [8, 0],
      duration: 1000,
      delay: stagger(45),
      ease: 'outExpo',
      // Put the original heading back so the gradient and wrapping stay exact.
      onComplete: () => split.revert(),
    });
  });
}

/** Words of a heading rise into place when its section scrolls into view. */
function riseWords(scope: HTMLElement) {
  $('[data-split]', scope).forEach((heading) => {
    const split = splitText(heading, { words: { wrap: 'clip' } });
    split.addEffect(({ words }) =>
      animate(words, {
        translateY: ['110%', '0%'],
        duration: 900,
        delay: stagger(70, { start: 80 }),
        ease: 'outExpo',
        onComplete: () => split.revert(),
      }),
    );
  });
}

const SLIDE_PARTS = '.pipeline__label, .pipeline__body, .pipeline__dot, .pipeline__line, .tag, [data-stat]';

/** Draw one slide's diagram step by step, then its stats. Returns when (ms) the drawing settles. */
function drawSlide(slide: HTMLElement, base: number): number {
  // Put every part back in its hidden state, in case this slide was shown before.
  $(SLIDE_PARTS, slide).forEach((el) => el.classList.remove('is-in'));

  const step = 280;
  const steps = $('[data-step]', slide);
  steps.forEach((s, i) => {
    const t = base + i * step;
    show($('.pipeline__label, .pipeline__body', s), { opacity: 0, translateX: -14 }, { delay: t, duration: 600 });
    show($('.pipeline__dot', s), { scale: 0 }, { delay: t + 60, duration: 700, ease: 'outBack(3)' });
    show($('.pipeline__line', s), { scaleY: 0 }, { delay: t + 200, duration: 380, ease: 'inOutSine' });
    show($('.tag', s), { opacity: 0, scale: 0.5 }, { delay: stagger(70, { start: t + 150 }), duration: 600, ease: 'outBack(2.4)' });
  });

  const statsAt = base + steps.length * step;
  show($('[data-stat]', slide), { opacity: 0, translateY: 16, scale: 0.9 }, { delay: stagger(120, { start: statsAt }), ease: 'outBack(1.6)' });
  $('[data-count]', slide).forEach((el, i) => countUp(el, statsAt + i * 120));
  return statsAt + 600;
}

/**
 * A glowing "order" travels down a slide's diagram on a loop, taking each
 * step's color and making that step's dot pulse as it arrives.
 * Returns a function that stops it and removes the dot.
 */
function startFlow(slide: HTMLElement): () => void {
  const list = slide.querySelector<HTMLElement>('.pipeline__steps');
  const dots = $('.pipeline__dot', slide);
  if (!list || dots.length < 2) return () => {};

  const token = document.createElement('span');
  token.className = 'pipeline__token';
  token.setAttribute('aria-hidden', 'true');
  list.append(token);

  let flow: ReturnType<typeof createTimeline> | undefined;

  const build = () => {
    flow?.revert();
    const origin = list.getBoundingClientRect();
    const points = dots.map((d) => {
      const r = d.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - origin.left,
        y: r.top + r.height / 2 - origin.top,
        color: getComputedStyle(d.closest('[data-step]')!).getPropertyValue('--c').trim(),
      };
    });

    token.style.left = `${points[0].x}px`;
    utils.set(token, { translateY: points[0].y, opacity: 0, backgroundColor: points[0].color });

    const tl = createTimeline({ loop: true, defaults: { ease: 'inOutCubic' } })
      .add(token, { opacity: [0, 1], scale: [0.4, 1], duration: 300 })
      .add(dots[0], { scale: [1, 1.9, 1], duration: 450, ease: 'outQuad' }, '<<');

    points.slice(1).forEach((pt, i) => {
      tl.add(token, { translateY: pt.y, backgroundColor: pt.color, duration: 500 }, '+=120').add(dots[i + 1], {
        scale: [1, 1.9, 1],
        duration: 450,
        ease: 'outQuad',
      });
    });

    tl.add(token, { opacity: 0, scale: 0.4, duration: 300 }, '+=200')
      .add(token, { translateY: points[0].y, backgroundColor: points[0].color, duration: 1 })
      .add({ duration: 500 });
    flow = tl;
  };

  build();
  let timer: number | undefined;
  const onResize = () => {
    clearTimeout(timer);
    timer = window.setTimeout(build, 200);
  };
  window.addEventListener('resize', onResize);

  return () => {
    clearTimeout(timer);
    window.removeEventListener('resize', onResize);
    flow?.revert();
    token.remove();
  };
}

let stopFlow: () => void = () => {};

function hero(): number {
  show($('[data-hero]'), { opacity: 0, translateY: 18 }, { delay: stagger(90, { start: 250 }), duration: 800 });
  show($('[data-hero-soft]'), { opacity: 0, translateY: 14 }, { delay: 350, duration: 900 });
  heroName();

  const pipeline = document.querySelector<HTMLElement>('[data-pipeline]');
  const first = pipeline?.querySelector<HTMLElement>('[data-slide].is-active');
  if (!pipeline || !first) return 0;
  show(pipeline, { opacity: 0, translateY: 32, scale: 0.96 }, { delay: 300, duration: 1000 });

  const done = drawSlide(first, 650);
  setTimeout(() => {
    if (first.classList.contains('is-active')) stopFlow = startFlow(first);
  }, done);
  return done;
}

/**
 * Hero project slider. Every SLIDE_MS a new project card slides in and draws
 * itself; the active pill fills up as a timer. Hovering, focusing inside it,
 * scrolling it off screen, or pressing pause stops the timer.
 * With reduced motion there is no autoplay and slides switch instantly.
 */
const SLIDE_MS = 5000;

function slider(animated: boolean, startAfter: number) {
  const box = document.querySelector<HTMLElement>('[data-showcase]');
  if (!box) return;
  const slides = $('[data-slide]', box);
  const pills = $('[data-pill]', box);
  const pauseBtn = box.querySelector<HTMLButtonElement>('[data-pause]');
  const label = box.querySelector<HTMLElement>('[data-count-label]');
  if (slides.length < 2) return;

  let index = 0;
  let userPaused = !animated;
  let hovering = false;
  let offscreen = false;
  let timer: ReturnType<typeof animate> | undefined;
  let flowDelay: number | undefined;

  box.classList.add('is-ready');
  if (animated) box.classList.add('is-auto');
  else box.classList.add('is-paused');

  const paused = () => userPaused || hovering || offscreen;

  const updatePause = () => {
    box.classList.toggle('is-paused', userPaused);
    pauseBtn?.setAttribute('aria-label', userPaused ? 'Play the project slideshow' : 'Pause the project slideshow');
    if (!timer) return;
    if (paused()) timer.pause();
    else timer.play();
  };

  // The active pill fills over SLIDE_MS; when it is full, the next slide comes in.
  const startTimer = () => {
    timer?.revert();
    timer = undefined;
    pills.forEach((p) => utils.set(p.querySelector('.pipeline__fill')!, { scaleX: 0 }));
    if (!animated) return;
    timer = animate(pills[index].querySelector('.pipeline__fill')!, {
      scaleX: [0, 1],
      duration: SLIDE_MS,
      ease: 'linear',
      onComplete: () => go(index + 1, 1),
    });
    if (paused()) timer.pause();
  };

  const go = (target: number, dir: 1 | -1) => {
    const next = (target + slides.length) % slides.length;
    if (next === index) return;
    const out = slides[index];
    const incoming = slides[next];

    stopFlow();
    stopFlow = () => {};
    clearTimeout(flowDelay);

    out.setAttribute('inert', '');
    incoming.removeAttribute('inert');
    pills.forEach((p, i) => (i === next ? p.setAttribute('aria-current', 'true') : p.removeAttribute('aria-current')));
    if (label) label.textContent = `${next + 1} / ${slides.length}`;

    if (animated) {
      animate(out, {
        opacity: [1, 0],
        translateX: [0, -56 * dir],
        duration: 450,
        ease: 'inQuad',
        onComplete: (self) => {
          if (!out.hasAttribute('inert')) return; // came back before the exit finished
          out.classList.remove('is-active');
          utils.cleanInlineStyles(self);
        },
      });
      incoming.classList.add('is-active');
      animate(incoming, {
        opacity: [0, 1],
        translateX: [56 * dir, 0],
        duration: 700,
        delay: 200,
        ease: 'outExpo',
        onComplete: (self) => utils.cleanInlineStyles(self),
      });
      const done = drawSlide(incoming, 300);
      flowDelay = window.setTimeout(() => {
        if (incoming.classList.contains('is-active') && !incoming.hasAttribute('inert')) stopFlow = startFlow(incoming);
      }, done);
    } else {
      out.classList.remove('is-active');
      incoming.classList.add('is-active');
    }

    index = next;
    startTimer();
  };

  pills.forEach((pill, i) => pill.addEventListener('click', () => go(i, i > index ? 1 : -1)));
  pauseBtn?.addEventListener('click', () => {
    userPaused = !userPaused;
    if (!userPaused && !timer && animated) startTimer();
    updatePause();
  });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(index + 1, 1);
    if (e.key === 'ArrowLeft') go(index - 1, -1);
  });
  box.addEventListener('pointerenter', () => {
    hovering = true;
    updatePause();
  });
  box.addEventListener('pointerleave', () => {
    hovering = false;
    updatePause();
  });
  box.addEventListener('focusin', () => {
    hovering = true;
    updatePause();
  });
  box.addEventListener('focusout', (e) => {
    if (box.contains(e.relatedTarget as Node)) return;
    hovering = false;
    updatePause();
  });
  new IntersectionObserver(([entry]) => {
    offscreen = !entry.isIntersecting;
    updatePause();
  }).observe(box);

  updatePause();
  // The first slide gets its full time after the intro has finished drawing it.
  if (animated) setTimeout(startTimer, startAfter);
}

function blobs() {
  $('[data-blob]').forEach((blob, i) => {
    animate(blob, {
      translateX: [0, (i % 2 ? -1 : 1) * (70 + i * 20)],
      translateY: [0, (i % 3 ? 1 : -1) * (50 + i * 15)],
      scale: [1, 1.18],
      duration: 6000 + i * 1300,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });
  });
}

function revealChildrenOf(container: HTMLElement, startDelay = 0) {
  $('[data-stagger]', container).forEach((group) => {
    show(Array.from(group.children) as HTMLElement[], { opacity: 0, scale: 0.6, translateY: 10 }, {
      delay: stagger(45, { start: startDelay + 250 }),
      duration: 650,
      ease: 'outBack(2)',
    });
  });
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);

        if (el.hasAttribute('data-reveal-group')) {
          const kids = Array.from(el.children) as HTMLElement[];
          show(kids, { opacity: 0, translateY: 56, scale: 0.94 }, { delay: stagger(130), duration: 1000 });
          kids.forEach((kid, i) => revealChildrenOf(kid, i * 130));
        } else {
          show(el, { opacity: 0, translateY: 36 }, { duration: 900 });
          riseWords(el);
          revealChildrenOf(el);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );

  $('[data-reveal], [data-reveal-group]').forEach((el) => observer.observe(el));
}

/**
 * The anime.js homepage effect: a grid of dots where a wave spreads out from a
 * point. It ripples from wherever you click in the hero, and on its own every
 * few seconds while the hero is on screen.
 */
function dotGrid() {
  const grid = document.querySelector<HTMLElement>('[data-dotgrid]');
  const hero = grid?.closest<HTMLElement>('.hero');
  if (!grid || !hero) return;

  const palette = ['#1a73e8', '#00897b', '#9334e6', '#e8710a', '#d93025', '#1e8e3e'];
  let cols = 0;
  let rows = 0;
  let dots: HTMLElement[] = [];
  let wave = 0;
  let visible = true;

  const build = () => {
    const cell = window.innerWidth < 640 ? 36 : 38;
    const c = Math.ceil(hero.offsetWidth / cell);
    const r = Math.ceil(hero.offsetHeight / cell);
    if (c === cols && r === rows) return;
    cols = c;
    rows = r;
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    grid.replaceChildren(...Array.from({ length: cols * rows }, () => document.createElement('span')));
    dots = Array.from(grid.children) as HTMLElement[];
  };

  const ripple = (from: number | 'center') => {
    const color = palette[wave++ % palette.length];
    animate(dots, {
      scale: [
        { to: 2.4, duration: 260, ease: 'outSine' },
        { to: 1, duration: 700, ease: 'inOutQuad' },
      ],
      translateY: [
        { to: -6, duration: 260, ease: 'outSine' },
        { to: 0, duration: 700, ease: 'outElastic(1, .5)' },
      ],
      backgroundColor: [
        { to: color, duration: 200 },
        { to: '#c3cbd6', duration: 900 },
      ],
      delay: stagger(32, { grid: [cols, rows], from }),
    });
  };

  const indexAt = (x: number, y: number) => {
    const box = grid.getBoundingClientRect();
    const col = Math.min(cols - 1, Math.max(0, Math.floor(((x - box.left) / box.width) * cols)));
    const row = Math.min(rows - 1, Math.max(0, Math.floor(((y - box.top) / box.height) * rows)));
    return row * cols + col;
  };

  build();
  // Ignore clicks on links and buttons so they keep working normally.
  hero.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    ripple(indexAt(e.clientX, e.clientY));
  });

  // First wave starts from the diagram once the intro has played.
  const pipeline = document.querySelector<HTMLElement>('[data-pipeline]');
  setTimeout(() => {
    const r = pipeline?.getBoundingClientRect();
    ripple(r ? indexAt(r.left + r.width / 2, r.top + r.height / 2) : 'center');
  }, 900);

  setInterval(() => {
    if (visible && !document.hidden) ripple(Math.floor(Math.random() * dots.length));
  }, 5000);

  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(hero);

  let timer: number | undefined;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = window.setTimeout(build, 200);
  });
}

/** The experience timeline's colored line fills in step with your scrolling. */
function timelineProgress() {
  const wrap = document.querySelector<HTMLElement>('[data-timeline]');
  const line = wrap?.querySelector<HTMLElement>('.timeline__progress');
  const markers = wrap ? $('.timeline__marker', wrap) : [];
  if (!wrap || !line || markers.length < 2) return;

  // The line runs from the first marker to the last one.
  const size = () => {
    const first = markers[0].getBoundingClientRect();
    const last = markers[markers.length - 1].getBoundingClientRect();
    line.style.height = `${last.top - first.top}px`;
  };
  size();
  window.addEventListener('resize', size);

  animate(line, {
    scaleY: [0, 1],
    ease: 'linear',
    autoplay: onScroll({
      target: wrap,
      enter: { target: 'top', container: 'center' },
      leave: { target: 'bottom', container: 'center' },
      sync: 0.25,
    }),
  });

  // Each marker pops as the line reaches it.
  markers.forEach((marker) => {
    animate(marker, {
      scale: [1, 1.7, 1],
      duration: 700,
      ease: 'outQuad',
      autoplay: onScroll({ target: marker, enter: { target: 'center', container: 'center' }, repeat: true }),
    });
  });
}

/**
 * Skill chips can be grabbed and flung; they stretch a little, then spring
 * back into place. Mouse and trackpad only, so touch scrolling is unaffected.
 */
function draggableChips() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  $('.skills-group__chips .chip').forEach((chip) => {
    chip.classList.add('is-draggable');
    createDraggable(chip, {
      container: [0, 0, 0, 0],
      containerFriction: 0.55,
      releaseEase: createSpring({ stiffness: 180, damping: 9 }),
      cursor: false,
      onGrab: () => {
        chip.style.zIndex = '5';
        animate(chip, { scale: 1.15, duration: 200, ease: 'outQuad' });
      },
      onRelease: () => {
        animate(chip, { scale: 1, duration: 400, ease: 'outBack(3)' });
      },
      onSettle: () => {
        chip.style.zIndex = '';
      },
    });
  });
}

// Animations run only when <html> has `motion` (not reduced motion, and the safety timer did not fire).
// The slider works either way; without motion it switches instantly and does not autoplay.
const animated = root.classList.contains('motion');
if (animated) {
  const introDone = hero();
  slider(true, introDone);
  blobs();
  revealOnScroll();
  // Build the dot grid once the intro is done and the browser is idle, to keep page load fast.
  const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1));
  setTimeout(() => idle(dotGrid), 1200);
  idle(() => {
    timelineProgress();
    draggableChips();
  });
} else {
  slider(false, 0);
}
