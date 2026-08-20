/* San Diego Spray Foam — progressive enhancement only.
   Every feature below degrades to working HTML if JS fails. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- Nav */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    var closeNav = function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    // Escape closes and returns focus to the trigger.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
        toggle.focus();
      }
    });

    // Tapping a link closes the drawer.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    // Reset state when we cross back to the desktop layout.
    var desktop = window.matchMedia('(min-width: 1100px)');
    var syncNav = function (mq) { if (mq.matches) closeNav(); };
    if (desktop.addEventListener) desktop.addEventListener('change', syncNav);
    else if (desktop.addListener) desktop.addListener(syncNav);
  }

  /* ------------------------------------------------------- Header state */
  var header = document.querySelector('.header');
  if (header) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > 12);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------- Reveal on scroll */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
    }
  }

  /* ------------------------------------------------------- Gallery modal */
  var lightbox = document.getElementById('lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    var lbImg = lightbox.querySelector('img');
    var lbCap = lightbox.querySelector('.lightbox__caption');
    var lastTrigger = null;

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.gallery__item');
      if (!trigger) return;
      var full = trigger.getAttribute('data-full');
      var img = trigger.querySelector('img');
      if (!full || !img) return;
      lastTrigger = trigger;
      lbImg.src = full;
      lbImg.alt = img.alt;
      lbCap.textContent = trigger.getAttribute('data-caption') || img.alt;
      lightbox.showModal();
    });

    lightbox.addEventListener('close', function () {
      lbImg.removeAttribute('src');
      if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
    });

    // Click the backdrop (outside the image) to dismiss.
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox__inner')) lightbox.close();
    });
  }

  /* ---------------------------------------------------------- Quote form */
  var form = document.getElementById('quote-form');
  if (form) {
    var status = form.querySelector('.form__status');
    var submit = form.querySelector('button[type="submit"]');
    var endpoint = form.getAttribute('action') || '';
    var configured = endpoint.indexOf('YOUR_FORM_ID') === -1 && endpoint.indexOf('http') === 0;

    var setStatus = function (msg, kind) {
      if (!status) return;
      status.textContent = msg;
      status.className = 'form__status is-visible form__status--' + kind;
    };

    // Field-level validation on blur, not on every keystroke.
    Array.prototype.forEach.call(form.querySelectorAll('input, textarea, select'), function (input) {
      input.addEventListener('blur', function () {
        var field = input.closest('.field');
        if (!field) return;
        var bad = !input.checkValidity() && input.value !== '';
        field.classList.toggle('has-error', bad);
        var err = field.querySelector('.field__error span');
        if (bad && err) err.textContent = input.validationMessage;
      });
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && input.checkValidity()) field.classList.remove('has-error');
      });
    });

    form.addEventListener('submit', function (e) {
      // Native validation first — focus the first invalid field.
      if (!form.checkValidity()) {
        e.preventDefault();
        // Note: ':invalid' alone also matches <form> and <fieldset>, which have
        // no .field wrapper and cannot take focus. Restrict it to real controls.
        var firstBad = form.querySelector('input:invalid, select:invalid, textarea:invalid');
        if (firstBad) {
          var f = firstBad.closest('.field');
          if (f) {
            f.classList.add('has-error');
            var err = f.querySelector('.field__error span');
            if (err) err.textContent = firstBad.validationMessage;
          }
          firstBad.focus();
        }
        setStatus('Please fix the highlighted fields and try again.', 'err');
        return;
      }

      // Honeypot: silently accept and discard bot submissions.
      var hp = form.querySelector('input[name="_gotcha"]');
      if (hp && hp.value) { e.preventDefault(); return; }

      // Without a configured endpoint, fall back to the user's mail client.
      if (!configured) {
        e.preventDefault();
        var get = function (n) {
          var el = form.elements[n];
          return el ? String(el.value).trim() : '';
        };
        var body = [
          'Name: ' + get('name'),
          'Phone: ' + get('phone'),
          'Email: ' + get('email'),
          'Property address: ' + get('address'),
          'Project type: ' + get('project'),
          '',
          get('message')
        ].join('\n');
        var href = 'mailto:' + form.getAttribute('data-email') +
          '?subject=' + encodeURIComponent('Free quote request — ' + (get('name') || 'Website')) +
          '&body=' + encodeURIComponent(body);
        setStatus('Opening your email app with the details filled in. If nothing happens, call 442-413-0520.', 'ok');
        window.location.href = href;
        return;
      }

      // Configured endpoint: submit over fetch so the visitor stays on the page.
      e.preventDefault();
      if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }
      setStatus('Sending your request…', 'ok');

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        form.reset();
        setStatus('Thanks — your request is in. We usually reply the same business day. Need us sooner? Call 442-413-0520.', 'ok');
      }).catch(function () {
        setStatus('Something went wrong sending the form. Please call 442-413-0520 or email sdsprayfoam@gmail.com.', 'err');
      }).then(function () {
        if (submit) { submit.disabled = false; submit.textContent = 'Request my free quote'; }
      });
    });
  }

  /* ------------------------------------------------------- Current year */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
