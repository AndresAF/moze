/* ============================================================
   MOZÉ · MAIN
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

// limitCallbacks: no dispara callbacks fuera de los límites del trigger.
// ignoreMobileResize: evita que la barra de direcciones del móvil, al
// aparecer y desaparecer, provoque un recálculo completo del layout.
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ------------------------------------------------------------
   0 · Variantes de sección
   ------------------------------------------------------------
   Las alternas viven en <template>, así que sus imágenes no se
   descargan salvo que se elijan. Se sustituyen antes de hidratar
   para que las rutas de foto se apliquen sobre el markup final.
------------------------------------------------------------ */
function applyVariants() {
  const v = (SITE && SITE.variantes) || {};
  Object.keys(v).forEach(sec => {
    const letra = String(v[sec] || 'a').toLowerCase();
    if (letra === 'a') return;
    const tpl    = document.getElementById(`v-${sec}-${letra}`);
    const actual = document.querySelector(`[data-sec="${sec}"]`);
    if (!tpl || !actual) return;
    actual.replaceWith(tpl.content.cloneNode(true));
  });
  // Ya cumplieron su función: fuera del documento.
  $$('template[id^="v-"]').forEach(t => t.remove());
}

/* ------------------------------------------------------------
   1 · Inyección de contenido
------------------------------------------------------------ */
function hydrate() {
  if (SITE.duotono) document.body.classList.add('duotone');

  const hero = $('#heroImg');
  if (hero) hero.src = SITE.fotos.hero;

  $$('[data-src-key]').forEach(img => {
    const key = img.dataset.srcKey;
    if (SITE.fotos[key]) {
      img.src = SITE.fotos[key];
      img.loading = 'lazy';
      img.decoding = 'async';
    }
  });

  const wa = $('#waLink');
  if (wa) wa.href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.waMensaje)}`;

  const maps = $('#mapsBtn');
  if (maps) maps.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;

  $$('a[href^="tel:"]').forEach(a => { a.href = 'tel:' + SITE.telefono; });

  const ig = $('a[href*="instagram"]');
  if (ig) ig.href = `https://instagram.com/${SITE.instagram}`;

  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
}

/* ------------------------------------------------------------
   2 · Loader → Hero
------------------------------------------------------------ */
function bootSequence() {
  const loader = $('#loader');
  const count  = $('#loaderCount');
  const bar    = $('#loaderBar');

  const heroIn = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.hero__frame',
        { clipPath: 'inset(18% 12% 18% 12%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 0)
      .fromTo('.hero__frame img',
        { scale: 1.32 }, { scale: 1.14, duration: 1.8, ease: 'expo.out' }, 0)
      .fromTo('[data-hero="1"] span',
        { yPercent: 120 }, { yPercent: 0, duration: .9 }, .55)
      .fromTo('[data-hero="2"]',
        { yPercent: 118 }, { yPercent: 0, duration: 1.15, stagger: .09 }, .65)
      .fromTo('[data-hero="3"]',
        { y: 26, opacity: 0 }, { y: 0, opacity: .82, duration: .9 }, 1.05)
      .fromTo('[data-hero="4"]',
        { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .1 }, 1.15)
      .add(() => $('.hero__title em')?.classList.add('is-lined'), 1.5);
  };

  if (REDUCED) {
    loader.style.display = 'none';
    $('.hero__title em')?.classList.add('is-lined');
    return;
  }

  const state = { v: 0 };
  const tl = gsap.timeline();

  tl.fromTo('[data-loader-word]', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' })
    .to(state, {
      v: 100, duration: 1.6, ease: 'power2.inOut',
      onUpdate() {
        const n = Math.round(state.v);
        count.textContent = String(n).padStart(2, '0');
        bar.style.width = n + '%';
      }
    }, .2)
    .to('[data-loader-word]', { yPercent: -110, duration: .8, ease: 'expo.inOut' }, '+=.1')
    .to('.loader__count,.loader__bar', { opacity: 0, duration: .4 }, '<')
    .to(loader, {
      yPercent: -100, duration: 1.1, ease: 'expo.inOut',
      onComplete() { loader.style.display = 'none'; ScrollTrigger.refresh(); }
    }, '-=.2')
    .add(heroIn, '-=.85');
}

/* ------------------------------------------------------------
   3 · Cursor + botones magnéticos (solo puntero fino)
------------------------------------------------------------ */
function pointerFX() {
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!fine || REDUCED) return;

  const cur  = $('#cursor');
  const dot  = $('.cursor__dot');
  const ring = $('.cursor__ring');
  document.body.classList.add('cursor-on');

  const xD = gsap.quickTo(dot,  'x', { duration: .12, ease: 'power3' });
  const yD = gsap.quickTo(dot,  'y', { duration: .12, ease: 'power3' });
  const xR = gsap.quickTo(ring, 'x', { duration: .45, ease: 'power3' });
  const yR = gsap.quickTo(ring, 'y', { duration: .45, ease: 'power3' });

  window.addEventListener('pointermove', e => {
    xD(e.clientX); yD(e.clientY); xR(e.clientX); yR(e.clientY);
  }, { passive: true });

  document.addEventListener('pointerover', e => {
    const hot = e.target.closest('a,button,input,select,textarea');
    document.body.classList.toggle('cursor-hot', !!hot);
  }, { passive: true });

  // Magnético
  $$('[data-magnetic]').forEach(el => {
    const x = gsap.quickTo(el, 'x', { duration: .5, ease: 'elastic.out(1,.4)' });
    const y = gsap.quickTo(el, 'y', { duration: .5, ease: 'elastic.out(1,.4)' });
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * .32);
      y((e.clientY - (r.top + r.height / 2)) * .42);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}

/* ------------------------------------------------------------
   4 · Navegación
------------------------------------------------------------ */
function navigation() {
  const nav    = $('#nav');
  const burger = $('#burger');
  const menu   = $('#menu');
  const links  = $$('.nav__links a');
  let open = false;

  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: self => nav.classList.toggle('is-solid', self.scroll() > 80)
  });

  const menuTl = gsap.timeline({ paused: true })
    .to(menu, { clipPath: 'inset(0 0 0% 0)', duration: .85, ease: 'expo.inOut' })
    .fromTo('.menu__list a', { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: .7, stagger: .06, ease: 'expo.out' }, '-=.45');

  const toggle = force => {
    open = force ?? !open;
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', !open);
    document.documentElement.classList.toggle('is-locked', open);
    open ? menuTl.play() : menuTl.reverse();
  };

  burger.addEventListener('click', () => toggle());
  $$('.menu__list a').forEach(a => a.addEventListener('click', () => toggle(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && open) toggle(false); });

  // Enlace activo según sección
  $$('main section[id]').forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 45%', end: 'bottom 45%',
      onToggle: self => {
        if (!self.isActive) return;
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + sec.id));
      }
    });
  });
}

/* ------------------------------------------------------------
   5 · Reveals de scroll
------------------------------------------------------------ */
function scrollReveals() {
  if (REDUCED) return;

  // Manifiesto: revelado palabra por palabra
  const man = $('[data-split]');
  if (man) {
    man.innerHTML = man.textContent.trim().split(/\s+/)
      .map(w => `<span class="w"><i>${w}</i></span>`).join(' ');
    gsap.from(man.querySelectorAll('i'), {
      scrollTrigger: { trigger: man, start: 'top 78%', end: 'bottom 62%', scrub: .6 },
      yPercent: 110, opacity: .1, stagger: .045, ease: 'power2.out'
    });
  }

  // Figuras: clip-path + parallax interno
  $$('[data-reveal]').forEach(fig => {
    const img = fig.querySelector('img');
    gsap.fromTo(fig,
      { clipPath: 'inset(0% 0% 100% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut',
        scrollTrigger: { trigger: fig, start: 'top 85%' }
      });
    if (img) {
      gsap.fromTo(img, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }
  });

  // Textos escalonados
  $$('section').forEach(sec => {
    const items = $$('[data-fade]', sec);
    if (!items.length) return;
    gsap.from(items, {
      scrollTrigger: { trigger: sec, start: 'top 72%' },
      y: 34, opacity: 0, duration: 1, stagger: .07, ease: 'expo.out'
    });
  });

  // Hero parallax al salir
  // Una sola línea de tiempo para las dos capas del hero:
  // un ScrollTrigger en vez de dos.
  gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .4 }
  })
    .to('.hero__frame', { yPercent: 12, ease: 'none' }, 0)
    .to('.hero__type',  { yPercent: -16, opacity: .25, ease: 'none' }, 0);
}

/* ------------------------------------------------------------
   6 · Contadores
------------------------------------------------------------ */
function counters() {
  $$('.num[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter() {
        if (REDUCED) { el.textContent = target.toLocaleString('es-MX'); return; }
        gsap.to(o, {
          v: target, duration: 2, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(o.v).toLocaleString('es-MX'); }
        });
      }
    });
  });
}

/* ------------------------------------------------------------
   7 · Galería horizontal (pin) — solo desktop/tablet
------------------------------------------------------------ */
function horizontalGallery() {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 721px) and (prefers-reduced-motion: no-preference)', () => {
    const pin   = $('#galleryPin');
    const track = $('#galleryTrack');
    const prog  = $('#galProgress');
    if (!pin || !track) return;

    const distance = () => track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => '+=' + distance(),
        invalidateOnRefresh: true,
        onUpdate: self => { prog.style.width = (self.progress * 100).toFixed(1) + '%'; }
      }
    });

    // Parallax de cada imagen dentro de su marco
    $$('.gal').forEach(fig => {
      gsap.fromTo(fig.querySelector('img'),
        { xPercent: -7 },
        {
          xPercent: 7, ease: 'none',
          scrollTrigger: {
            trigger: fig, containerAnimation: tween,
            start: 'left right', end: 'right left', scrub: true
          }
        });
    });

    return () => { prog.style.width = '0%'; };
  });

  mm.add('(max-width: 720px)', () => {
    if (REDUCED) return;
    $$('.gal').forEach(fig => {
      gsap.fromTo(fig, { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: fig, start: 'top 88%' } });
    });
  });
}

/* ------------------------------------------------------------
   7b · Galería 'b' · columnas a distintas velocidades
------------------------------------------------------------ */
function columnGallery() {
  const grid = $('#colgal');
  if (!grid) return;

  // Entrada: cada foto se descubre de abajo hacia arriba
  if (!REDUCED) {
    $$('.colgal__f', grid).forEach(fig => {
      gsap.fromTo(fig,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: fig, start: 'top 88%' } });
    });
  }

  // Desfase vertical por columna: sólo donde hay espacio para ello
  gsap.matchMedia().add('(min-width: 721px) and (prefers-reduced-motion: no-preference)', () => {
    const cols = $$('.colgal__col', grid);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: grid, start: 'top bottom', end: 'bottom top', scrub: .6 }
    });
    cols.forEach(col => {
      const s = +col.dataset.speed || 0;
      tl.fromTo(col, { yPercent: -s * 0.18 }, { yPercent: s * 0.18, ease: 'none' }, 0);
    });
  });
}

/* ------------------------------------------------------------
   8 · Marquesinas moduladas por velocidad de scroll
   ------------------------------------------------------------
   Un solo ticker global para todas: nada de un rAF por elemento.
------------------------------------------------------------ */
const MARQUEES = [];

function fillTrack(track, minWidth) {
  const seed = track.innerHTML;
  if (!seed.trim()) return 0;
  let guard = 0;
  while (track.scrollWidth < minWidth && guard++ < 14) track.insertAdjacentHTML('beforeend', seed);
  track.insertAdjacentHTML('beforeend', track.innerHTML);   // duplicado para el bucle
  return track.scrollWidth / 2;
}

function registerMarquee(track, { speed = 24, dir = 1, watch } = {}) {
  // El HTML trae un solo juego. Clonamos hasta cubrir de sobra el
  // ancho visible y duplicamos una vez: así la mitad del recorrido
  // siempre es más ancha que la pantalla y el bucle nunca deja hueco.
  const half = fillTrack(track, window.innerWidth * 1.5);
  if (!half) return;

  const m = { track, half, speed, dir, x: 0, live: false,
              setX: gsap.quickSetter(track, 'x', 'px') };

  // Solo consume fotogramas mientras está a la vista.
  ScrollTrigger.create({
    trigger: watch || track, start: 'top bottom', end: 'bottom top',
    onToggle: self => { m.live = self.isActive; }
  });

  MARQUEES.push(m);
}

function marquees() {
  if (REDUCED) return;

  $$('[data-marquee]').forEach(el => {
    const track = el.querySelector('.ribbon__track, .ticker__track');
    if (track) registerMarquee(track, { speed: +el.dataset.speed || 24, dir: +el.dataset.dir || 1, watch: el });
  });

  $$('.band').forEach(band => {
    const track = band.querySelector('.band__track');
    if (track) registerMarquee(track, { speed: +band.dataset.speed || 20, dir: +band.dataset.dir || 1, watch: band });
  });

  if (!MARQUEES.length) return;

  // La velocidad del scroll acelera y puede invertir el sentido
  let boost = 0;
  ScrollTrigger.create({
    onUpdate: self => {
      boost = gsap.utils.clamp(-9, 9, self.getVelocity() / 260);
    }
  });

  gsap.ticker.add(() => {
    boost = gsap.utils.interpolate(boost, 0, 0.045);
    const dt = gsap.ticker.deltaRatio();
    for (let i = 0; i < MARQUEES.length; i++) {
      const m = MARQUEES[i];
      if (!m.live) continue;                       // fuera de pantalla: cero trabajo
      m.x -= (m.speed / 60 * dt) * m.dir * (1 + Math.abs(boost)) + boost * m.dir;
      if (m.x <= -m.half) m.x += m.half;
      else if (m.x > 0)   m.x -= m.half;
      m.setX(m.x);
    }
  });

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      MARQUEES.forEach(m => { m.half = m.track.scrollWidth / 2; });
    }, 250);
  });
}

/* ------------------------------------------------------------
   9 · Eventos: bandas que ceden espacio entre sí
------------------------------------------------------------ */
function eventBands() {
  const wrap  = $('#bands');
  const bands = $$('.band');
  if (!wrap || !bands.length) return;

  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  const activate = band => {
    bands.forEach(b => b.classList.toggle('is-active', b === band));
    wrap.classList.toggle('has-active', !!band);
  };

  if (fine && !REDUCED) {
    bands.forEach(band => {
      band.addEventListener('pointerenter', () => activate(band));
    });
    wrap.addEventListener('pointerleave', () => activate(null));
    return;
  }

  // Táctil y reduced-motion: la banda centrada en pantalla se activa sola
  if (REDUCED) return;
  bands.forEach(band => {
    ScrollTrigger.create({
      trigger: band, start: 'top 62%', end: 'bottom 38%',
      onToggle: self => { if (self.isActive) activate(band); }
    });
  });
}

/* ------------------------------------------------------------
   10 · Servicios: paneles que se apilan
------------------------------------------------------------ */
function servicePile() {
  if (REDUCED) return;
  const items = $$('.pile__item');
  if (items.length < 2) return;

  gsap.matchMedia().add('(min-width: 721px)', () => {
    items.forEach((item, i) => {
      const next = items[i + 1];
      if (!next) return;
      gsap.to(item, {
        scale: 0.94, opacity: .45, ease: 'none',
        scrollTrigger: {
          trigger: next, start: 'top bottom', end: 'top top+=140', scrub: true
        }
      });
    });

    // La foto respira dentro de su marco
    items.forEach(item => {
      gsap.fromTo(item.querySelector('img'), { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  });

  gsap.from(items, {
    y: 40, opacity: 0, duration: .9, stagger: .05, ease: 'expo.out',
    scrollTrigger: { trigger: '#pile', start: 'top 78%' }
  });
}

/* ------------------------------------------------------------
   11 · Formulario
------------------------------------------------------------ */
function contactForm() {
  const form   = $('#form');
  const status = $('#formStatus');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;

    ['#f-name', '#f-mail', '#f-tel', '#f-type'].forEach(sel => {
      const el = $(sel);
      const wrap = el.closest('.f');
      const valid = el.value.trim() !== '' &&
        (el.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
      wrap.classList.toggle('is-error', !valid);
      if (!valid) ok = false;
    });

    if (!ok) {
      status.textContent = 'Revisa los campos marcados.';
      gsap.fromTo(form, { x: -6 }, { x: 0, duration: .5, ease: 'elastic.out(1,.35)' });
      return;
    }

    /* ⚠️ CONECTA AQUÍ TU BACKEND
       Opción rápida (sin servidor): crea un formulario en formspree.io
       y descomenta:

       fetch('https://formspree.io/f/TU_ID', {
         method:'POST',
         headers:{'Accept':'application/json'},
         body:new FormData(form)
       });
    */

    const d = new FormData(form);
    const msg =
      `Hola, quiero información para un evento en Mozé.%0A%0A` +
      `Nombre: ${d.get('nombre')}%0A` +
      `Email: ${d.get('email')}%0A` +
      `Teléfono: ${d.get('telefono')}%0A` +
      `Tipo: ${d.get('tipo')}%0A` +
      `Fecha: ${d.get('fecha') || 'por definir'}%0A` +
      `Invitados: ${d.get('invitados') || 'por definir'}%0A` +
      `Mensaje: ${d.get('mensaje') || '—'}`;

    status.textContent = 'Abriendo WhatsApp…';
    window.open(`https://wa.me/${SITE.whatsapp}?text=${msg}`, '_blank');

    setTimeout(() => {
      form.reset();
      status.textContent = 'Gracias. Te contactamos en menos de 24 h.';
    }, 600);
  });

  $$('.f input,.f select,.f textarea').forEach(el => {
    el.addEventListener('input', () => el.closest('.f').classList.remove('is-error'));
  });
}

/* ------------------------------------------------------------
   12 · Init
------------------------------------------------------------ */
window.addEventListener('DOMContentLoaded', () => {
  applyVariants();
  hydrate();
  navigation();
  pointerFX();
  scrollReveals();
  counters();
  horizontalGallery();
  columnGallery();
  eventBands();
  servicePile();
  contactForm();
  bootSequence();

  // Medir las marquesinas sólo cuando la tipografía definitiva ya está
  // aplicada; si no, el ancho calculado sería el de la fuente de respaldo.
  const iniciarMarquesinas = () => { marquees(); ScrollTrigger.refresh(); };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(iniciarMarquesinas);
  } else {
    window.addEventListener('load', iniciarMarquesinas);
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());

  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => ScrollTrigger.refresh(), 220);
  });
});
