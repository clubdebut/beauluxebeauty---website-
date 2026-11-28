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

  /* =====================================================================
     BLACK FRIDAY CAMPAIGN  (27-30 November 2026)
     To retire the campaign: delete blackfriday.html, remove the pop-up
     markup from index.html, the teaser strip, the "Black Friday" nav
     items, and this whole block.
     ===================================================================== */

  /* ---------------------------------------------------------------------
     1. PURCHASE LINKS - the only place to change.
     Paste each offer's checkout URL (e.g. a Square payment link) beside
     its key. Anything left as '' falls back to BF_FALLBACK, so a button
     is never dead. Keys match data-bf="..." in the HTML.
     --------------------------------------------------------------------- */
  var BF_FALLBACK = 'contact.html#enquiry';

  var BF_LINKS = {
    'skincare'    : '',   /* 01  FACTORFIVE regimen        */
    'facial'      : '',   /* 02  FACTORFIVE Glow Facial    */
    'biojet'      : '',   /* 03  BioJet skin renewal       */
    'laser'       : '',   /* 04  Laser hair removal        */
    'tattoo'      : '',   /* 05  Laser tattoo removal      */
    'pmu'         : '',   /* 06  Permanent makeup          */
    'consult'     : '',   /* Complimentary consultation    */
    'f5-cleanser' : '',
    'f5-serum'    : '',
    'f5-silk'     : '',
    'f5-cream'    : '',
    'f5-mask'     : ''
  };

  document.querySelectorAll('[data-bf]').forEach(function (el) {
    var bfUrl = (BF_LINKS[el.getAttribute('data-bf')] || '').replace(/^\s+|\s+$/g, '');
    el.setAttribute('href', bfUrl || BF_FALLBACK);
    if (bfUrl && /^https?:/i.test(bfUrl)) {
      el.setAttribute('rel', 'noopener');
      el.setAttribute('target', '_blank');
    }
  });

  /* ---------- 2. Offer videos: load and play only when scrolled to ------
     Six portrait clips would be several MB if they all loaded up front,
     so each carries data-src and is attached on approach instead. */
  var bfReduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bfVids = document.querySelectorAll('video[data-src]');

  if (bfVids.length) {
    if (bfReduce) {
      bfVids.forEach(function (v) {
        v.src = v.getAttribute('data-src');
        v.setAttribute('controls', '');
      });
    } else if ('IntersectionObserver' in window) {
      var bfio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            if (!v.src) { v.src = v.getAttribute('data-src'); }
            var pr = v.play();
            if (pr && pr.catch) { pr.catch(function () {}); }
          } else if (v.src && !v.paused) {
            v.pause();
          }
        });
      }, { rootMargin: '220px 0px', threshold: 0.1 });
      bfVids.forEach(function (v) { bfio.observe(v); });
    } else {
      bfVids.forEach(function (v) { v.src = v.getAttribute('data-src'); });
    }
  }

  /* ---------- 3. Homepage pop-up --------------------------------------
     Shows once per browsing session, and never after the campaign ends. */
  var pop = document.getElementById('bfpop');
  if (pop) {
    var BF_ENDS = new Date(2026, 11, 1, 0, 0, 0);   /* 1 Dec 2026, local */
    var BF_KEY = 'blb-bf-2026';
    var popBox = pop.querySelector('.bfpop__box');
    var popClose = pop.querySelector('.bfpop__close');
    var popScrim = pop.querySelector('.bfpop__scrim');
    var popReturn = null;

    var bfSeen = function () {
      try { return window.sessionStorage.getItem(BF_KEY) === '1'; }
      catch (e) { return false; }
    };
    var bfMark = function () {
      try { window.sessionStorage.setItem(BF_KEY, '1'); } catch (e) {}
    };

    var popKey = function (e) {
      if (e.key === 'Escape') { popHide(); return; }
      if (e.key !== 'Tab' || !popBox) { return; }
      var f = popBox.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) { return; }
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    var popShow = function () {
      popReturn = document.activeElement;
      pop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () { pop.classList.add('is-in'); });
      if (popClose) { popClose.focus(); }
      document.addEventListener('keydown', popKey);
    };

    var popHide = function () {
      bfMark();
      pop.classList.remove('is-in');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', popKey);
      window.setTimeout(function () { pop.classList.remove('is-open'); }, 420);
      if (popReturn && popReturn.focus) { popReturn.focus(); }
    };

    if (popClose) { popClose.addEventListener('click', popHide); }
    if (popScrim) { popScrim.addEventListener('click', popHide); }
    pop.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', bfMark);
    });

    if (!bfSeen() && Date.now() < BF_ENDS.getTime()) {
      window.setTimeout(popShow, 1500);
    }
  }

})();
