/* ==========================================================================
   Beau Luxe Beauty — site behaviour
   Vanilla JS, no dependencies. Loaded with `defer`.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     BOOKING LINK — single place to change.
     Replace with your live booking URL (e.g. your scheduler or Squarespace
     booking page). Every "Book a Consultation" button uses this.
     --------------------------------------------------------------------- */
  var BOOKING_URL = 'contact.html';

  document.querySelectorAll('[data-book]').forEach(function (el) {
    el.setAttribute('href', BOOKING_URL);
  });

  /* ---------- Header: solid on scroll ---------- */
  var header = document.querySelector('.header');
  var hasHero = document.querySelector('.hero, .phero');
  var solidAt = 40;

  function onScroll() {
    if (!header) return;
    var past = window.scrollY > (hasHero ? solidAt : 10);
    header.classList.toggle('is-solid', past);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Re-enable transitions once the initial state has been painted. */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.documentElement.classList.remove('no-anim');
    });
  });

  /* ---------- Mobile drawer ---------- */
  var burger = document.querySelector('.burger');
  var drawer = document.querySelector('.drawer');
  var body = document.body;

  function closeDrawer() {
    body.classList.remove('nav-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (drawer) drawer.setAttribute('aria-hidden', 'true');
  }

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('nav-open')) {
      closeDrawer();
      if (burger) burger.focus();
    }
  });

  /* ---------- Accordion (Q&A) ---------- */
  document.querySelectorAll('.acc').forEach(function (item) {
    var btn = item.querySelector('.acc__btn');
    var panel = item.querySelector('.acc__panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      var group = item.closest('.accordion');

      // Close siblings in the same group
      if (group && !isOpen) {
        group.querySelectorAll('.acc.is-open').forEach(function (other) {
          other.classList.remove('is-open');
          var ob = other.querySelector('.acc__btn');
          var op = other.querySelector('.acc__panel');
          if (ob) ob.setAttribute('aria-expanded', 'false');
          if (op) op.style.height = '0px';
        });
      }

      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.style.height = isOpen ? '0px' : panel.scrollHeight + 'px';
    });
  });

  // Keep open panels correctly sized on resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      document.querySelectorAll('.acc.is-open .acc__panel').forEach(function (p) {
        p.style.height = p.scrollHeight + 'px';
      });
    }, 150);
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll() {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
    reveals = [];
  }

  if (reduce || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });

    /*
      Backstop. Fast or programmatic scrolling can outrun IntersectionObserver,
      which would leave content stuck at opacity:0 forever. This sweep reveals
      anything that has already reached the viewport, and is the safety net that
      guarantees content is never permanently invisible.
    */
    var sweeping = false;
    function sweep() {
      sweeping = false;
      if (!reveals.length) return;
      var limit = window.innerHeight * 0.95;
      reveals = reveals.filter(function (el) {
        if (el.classList.contains('is-in')) return false;
        if (el.getBoundingClientRect().top < limit) {
          el.classList.add('is-in');
          io.unobserve(el);
          return false;
        }
        return true;
      });
    }
    function queueSweep() {
      if (sweeping) return;
      sweeping = true;
      requestAnimationFrame(sweep);
    }
    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep);
    window.addEventListener('load', queueSweep);
    queueSweep();

    // Final guarantee: nothing stays hidden after the page has settled.
    setTimeout(function () { if (reveals.length) sweep(); }, 3000);
  }

  /* ---------- Current year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------------------------------------------------------------------
     CONSULTATION FORM
     This is a front-end demo handler: it validates, then shows a confirmation
     panel. NOTHING IS SENT ANYWHERE YET.

     To make it live, either:
       a) set the <form> action/method to your form provider's endpoint
          (Formspree, Netlify Forms, your booking system) and delete the
          preventDefault() block below, or
       b) POST `data` to your own endpoint inside the handler.
     --------------------------------------------------------------------- */
  var form = document.querySelector('[data-consult-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (form.getAttribute('action')) return; // real endpoint configured — let it submit
      e.preventDefault();

      if (!form.reportValidity()) return;

      var status = form.querySelector('.form__status');
      var data = Object.fromEntries(new FormData(form).entries());
      // eslint-disable-next-line no-console
      console.log('Consultation request (not yet sent anywhere):', data);

      if (status) {
        status.classList.add('is-visible');
        status.setAttribute('role', 'status');
        status.focus({ preventScroll: true });
        status.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      }
      form.reset();
    });
  }

  /* ---------- Pause background video when off-screen ---------- */
  var bgVideos = document.querySelectorAll('video[data-bg]');
  if (bgVideos.length && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.05 });
    bgVideos.forEach(function (v) { vio.observe(v); });
  }
})();
