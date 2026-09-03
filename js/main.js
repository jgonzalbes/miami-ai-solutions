/* =============================================================================
   Miami AI Solutions — main.js
   Vanilla JS, no dependencies. Every block guards on the elements existing,
   so the same file is safe to load on all five pages.
   ============================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    var setNav = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close when a link inside the menu is used.
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) { setNav(false); }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    // Reset when the layout goes back to the desktop nav.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) { setNav(false); }
    });
  }

  /* ---------------------------------------------------------------------------
     FAQ accordion — single open at a time
     --------------------------------------------------------------------------- */
  var questions = document.querySelectorAll('.faq-q');

  Array.prototype.forEach.call(questions, function (button) {
    button.addEventListener('click', function () {
      var panel = document.getElementById(button.getAttribute('aria-controls'));
      var isOpen = button.getAttribute('aria-expanded') === 'true';

      Array.prototype.forEach.call(questions, function (other) {
        var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
        other.setAttribute('aria-expanded', 'false');
        if (otherPanel) { otherPanel.classList.remove('is-open'); }
      });

      if (!isOpen) {
        button.setAttribute('aria-expanded', 'true');
        if (panel) { panel.classList.add('is-open'); }
      }
    });
  });

  /* ---------------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }

  /* ---------------------------------------------------------------------------
     Contact form — client-side validation + honest missing-backend state
     --------------------------------------------------------------------------- */
  var form = document.getElementById('contact-form');
  if (!form) { return; }

  var ENDPOINT_PLACEHOLDER = 'REPLACE_WITH_YOUR_FORM_ENDPOINT';
  var status = document.getElementById('form-status');
  var honeypot = form.querySelector('[name="company-website"]');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = {
    name: function (value) {
      return value.trim().length >= 2 ? '' : 'Please enter your name.';
    },
    email: function (value) {
      if (!value.trim()) { return 'Please enter your email address.'; }
      return EMAIL_RE.test(value.trim()) ? '' : 'Please enter a valid email address.';
    },
    message: function (value) {
      if (!value.trim()) { return 'Please tell us about the project.'; }
      return value.trim().length >= 10 ? '' : 'Please add a little more detail (at least 10 characters).';
    }
  };

  var setError = function (field, message) {
    var box = document.getElementById(field.id + '-error');
    if (box) {
      box.textContent = message;
      box.classList.toggle('is-visible', Boolean(message));
    }
    if (message) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  };

  var setStatus = function (message, kind) {
    if (!status) { return; }
    status.textContent = message;
    status.classList.remove('is-error', 'is-ok');
    if (kind) { status.classList.add(kind); }
  };

  var validateField = function (field) {
    var rule = rules[field.name];
    if (!rule) { return true; }
    var message = rule(field.value);
    setError(field, message);
    return !message;
  };

  Object.keys(rules).forEach(function (name) {
    var field = form.elements[name];
    if (!field) { return; }
    // Validate on blur, then live-correct once the visitor has seen an error.
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') { validateField(field); }
    });
  });

  form.addEventListener('submit', function (event) {
    var firstInvalid = null;

    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      if (field && !validateField(field) && !firstInvalid) { firstInvalid = field; }
    });

    if (firstInvalid) {
      event.preventDefault();
      setStatus('Please fix the highlighted fields and try again.', 'is-error');
      firstInvalid.focus();
      return;
    }

    // Honeypot: a real visitor never sees or fills this field.
    if (honeypot && honeypot.value) {
      event.preventDefault();
      console.warn('[contact form] Submission blocked: honeypot field was filled.');
      return;
    }

    // No backend wired up yet — say so instead of faking a successful send.
    if (form.getAttribute('action').indexOf(ENDPOINT_PLACEHOLDER) !== -1) {
      event.preventDefault();
      console.warn(
        '[contact form] The form action is still "' + ENDPOINT_PLACEHOLDER + '", so nothing was sent. ' +
        'Set a real endpoint on <form action="..."> in contact.html — see README.md for the ' +
        'Formspree and Netlify Forms setup.'
      );
      setStatus(
        'Thanks — but this form is not connected to an inbox yet, so your message was not sent. ' +
        'Please email us directly for now.',
        'is-error'
      );
      return;
    }

    setStatus('Sending your message…');
  });
}());
