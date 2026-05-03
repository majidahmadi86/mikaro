/**
 * MIKARO STUDIO — form.js
 * Contact form: validation, antispam (honeypot + timing + rate limit),
 * live field feedback, WhatsApp pre-filled message handoff.
 * OWASP-aligned: input sanitisation, no eval, no innerHTML from user data.
 */
(function () {
  'use strict';

  /* ─── CONFIG ─── */
  const WA_NUMBER       = '66951967330';
  const MIN_SUBMIT_MS   = 4000;   // bot timing: under 4s = reject
  const RATE_LIMIT_MS   = 30000;  // 30s cooldown after submit
  const EMAIL_RE        = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  const NAME_MIN        = 2;
  const NAME_MAX        = 80;
  const MSG_MAX         = 2000;

  /* ─── STATE ─── */
  let lastSubmitTime = 0;
  let isSubmitting   = false;

  /* ─── DOM REFS (resolved after DOM ready) ─── */
  let form, btnSubmit, btnOrigHTML;
  let fName, fEmail, fService, fMessage;
  let errName, errEmail, errMsg;
  let globalMsg;
  let honeypot, tsField;

  /* ─── SANITISE: strip HTML/script from any string ─── */
  function sanitise(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  }

  /* ─── FIELD STATE HELPERS ─── */
  function setErr(input, errEl, msg) {
    input.classList.add('err');
    input.classList.remove('ok');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('show');
    }
  }

  function setOk(input, errEl) {
    input.classList.remove('err');
    input.classList.add('ok');
    if (errEl) errEl.classList.remove('show');
  }

  function clearState(input, errEl) {
    input.classList.remove('err', 'ok');
    if (errEl) errEl.classList.remove('show');
  }

  /* ─── INDIVIDUAL VALIDATORS ─── */
  function validateName(val) {
    const v = val.trim();
    if (!v)                return 'Your name is required.';
    if (v.length < NAME_MIN) return 'Name must be at least 2 characters.';
    if (v.length > NAME_MAX) return 'Name is too long (max 80 characters).';
    if (/[<>{}]/.test(v))  return 'Name contains invalid characters.';
    return null;
  }

  function validateEmail(val) {
    const v = val.trim();
    if (!v)              return 'Email address is required.';
    if (!EMAIL_RE.test(v)) return 'Please enter a valid email address.';
    if (v.length > 254)  return 'Email address is too long.';
    return null;
  }

  function validateMessage(val) {
    const v = val.trim();
    if (v.length > MSG_MAX) return `Message too long (max ${MSG_MAX} characters).`;
    return null;
  }

  /* ─── LIVE VALIDATION — blur events ─── */
  function attachLiveValidation() {
    if (!fName || !fEmail) return;

    fName.addEventListener('blur', function () {
      const err = validateName(this.value);
      if (this.value.trim()) {
        err ? setErr(this, errName, err) : setOk(this, errName);
      }
    });

    fName.addEventListener('input', function () {
      if (this.classList.contains('err') && !validateName(this.value)) {
        setOk(this, errName);
      }
    });

    fEmail.addEventListener('blur', function () {
      const err = validateEmail(this.value);
      if (this.value.trim()) {
        err ? setErr(this, errEmail, err) : setOk(this, errEmail);
      }
    });

    fEmail.addEventListener('input', function () {
      if (this.classList.contains('err') && !validateEmail(this.value)) {
        setOk(this, errEmail);
      }
    });

    if (fMessage) {
      fMessage.addEventListener('input', function () {
        const remaining = MSG_MAX - this.value.length;
        if (remaining < 100) {
          this.style.borderColor = remaining < 0 ? 'rgba(239,68,68,.6)' : 'rgba(201,168,76,.4)';
        } else {
          this.style.borderColor = '';
        }
      });
    }
  }

  /* ─── GLOBAL MESSAGE BANNER ─── */
  function showBanner(type, text) {
    if (!globalMsg) return;
    // type: 'error' | 'success'
    globalMsg.className = 'form-msg show form-msg--' + type;
    globalMsg.textContent = text;
    if (type === 'error') {
      setTimeout(() => {
        if (globalMsg) globalMsg.classList.remove('show');
      }, 6000);
    }
  }

  function hideBanner() {
    if (globalMsg) globalMsg.classList.remove('show');
  }

  /* ─── BUTTON STATE ─── */
  function setBtnLoading() {
    if (!btnSubmit) return;
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Opening WhatsApp…';
  }

  function setBtnSuccess() {
    if (!btnSubmit) return;
    btnSubmit.disabled = true;
    btnSubmit.textContent = '✓ Message prepared — opening WhatsApp';
    btnSubmit.style.background = '#22c55e';
  }

  function setBtnCooldown(remainingMs) {
    if (!btnSubmit) return;
    let secs = Math.ceil(remainingMs / 1000);
    btnSubmit.disabled = true;
    btnSubmit.textContent = `Please wait ${secs}s before sending again`;
    const iv = setInterval(() => {
      secs -= 1;
      if (secs <= 0) {
        clearInterval(iv);
        resetBtn();
      } else {
        btnSubmit.textContent = `Please wait ${secs}s before sending again`;
      }
    }, 1000);
  }

  function resetBtn(delayed) {
    const reset = () => {
      if (!btnSubmit) return;
      btnSubmit.disabled = false;
      btnSubmit.style.background = '';
      btnSubmit.innerHTML = btnOrigHTML;
    };
    if (delayed) {
      setTimeout(reset, delayed);
    } else {
      reset();
    }
  }

  /* ─── BUILD WHATSAPP MESSAGE ─── */
  function buildWAMessage(name, email, service, message) {
    const svc  = service  || 'Not specified';
    const msg  = message  || 'No additional details provided';
    const text = [
      'Hello! I found Mikaro Studio and I\'d like to get in touch.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Service: ${svc}`,
      '',
      `Message: ${msg}`,
      '',
      '— Sent via mikaro.studio'
    ].join('\n');
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  /* ─── MAIN SUBMIT HANDLER ─── */
  function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    hideBanner();

    /* 1. Honeypot check — silently succeed for bots */
    if (honeypot && honeypot.value) {
      fakeSuccess();
      return;
    }

    /* 2. Timing check — bots fill forms too fast */
    const elapsed = Date.now() - parseInt(tsField ? tsField.value : '0', 10);
    if (elapsed < MIN_SUBMIT_MS) {
      showBanner('error', 'Please take a moment to review your details before sending.');
      return;
    }

    /* 3. Rate limit — prevent spam clicking */
    const now = Date.now();
    if (lastSubmitTime && (now - lastSubmitTime) < RATE_LIMIT_MS) {
      setBtnCooldown(RATE_LIMIT_MS - (now - lastSubmitTime));
      return;
    }

    /* 4. Validate all fields */
    let valid = true;

    const nameErr = validateName(fName ? fName.value : '');
    if (nameErr) { setErr(fName, errName, nameErr); valid = false; }
    else if (fName && fName.value.trim()) setOk(fName, errName);

    const emailErr = validateEmail(fEmail ? fEmail.value : '');
    if (emailErr) { setErr(fEmail, errEmail, emailErr); valid = false; }
    else if (fEmail && fEmail.value.trim()) setOk(fEmail, errEmail);

    if (fMessage) {
      const msgErr = validateMessage(fMessage.value);
      if (msgErr) {
        showBanner('error', msgErr);
        valid = false;
      }
    }

    if (!valid) {
      showBanner('error', 'Please fix the highlighted fields before sending.');
      /* Focus first invalid field */
      const firstErr = form.querySelector('.form-input.err');
      if (firstErr) firstErr.focus();
      return;
    }

    /* 5. Sanitise values */
    const name    = sanitise(fName.value.trim());
    const email   = sanitise(fEmail.value.trim());
    const service = fService ? sanitise(fService.value) : '';
    const message = fMessage ? sanitise(fMessage.value.trim()) : '';

    /* 6. Open WhatsApp */
    isSubmitting = true;
    setBtnLoading();

    const waURL = buildWAMessage(name, email, service, message);
    window.open(waURL, '_blank', 'noopener,noreferrer');

    /* 7. Update state */
    lastSubmitTime = Date.now();
    setBtnSuccess();
    showBanner('success', '✓ Your details have been prepared. Complete the conversation on WhatsApp to confirm your project.');

    /* 8. Reset form after delay */
    setTimeout(() => {
      if (form) form.reset();
      [fName, fEmail, fService, fMessage].forEach(el => {
        if (el) { el.classList.remove('ok', 'err'); el.style.borderColor = ''; }
      });
      [errName, errEmail].forEach(el => { if (el) el.classList.remove('show'); });
      /* Update timestamp for next submission */
      if (tsField) tsField.value = String(Date.now());
      isSubmitting = false;
      resetBtn();
    }, 5000);
  }

  /* ─── FAKE SUCCESS (honeypot triggered) ─── */
  function fakeSuccess() {
    setBtnSuccess();
    setTimeout(() => { resetBtn(); if (form) form.reset(); }, 3000);
  }

  /* ─── INIT ─── */
  function init() {
    form = document.getElementById('contactForm');
    if (!form) return; /* not on this page */

    btnSubmit    = form.querySelector('.form-submit');
    btnOrigHTML  = btnSubmit ? btnSubmit.innerHTML : '';
    fName        = document.getElementById('fn');
    fEmail       = document.getElementById('fe');
    fService     = document.getElementById('fs');
    fMessage     = document.getElementById('fm');
    errName      = document.getElementById('fn-err');
    errEmail     = document.getElementById('fe-err');
    globalMsg    = document.getElementById('formErrMsg');
    honeypot     = document.getElementById('hp_website');
    tsField      = document.getElementById('form_ts');

    /* Set load timestamp — used for bot timing detection */
    if (tsField) tsField.value = String(Date.now());

    /* Wire up submit */
    form.addEventListener('submit', handleSubmit);

    /* Live validation */
    attachLiveValidation();

    /* Clear global banner on any field interaction */
    form.addEventListener('input', function () {
      if (globalMsg && globalMsg.classList.contains('form-msg--error')) {
        hideBanner();
      }
    });

    /* Prevent accidental double-submit on Enter */
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        const isBtn = e.target === btnSubmit;
        if (!isBtn) {
          e.preventDefault();
          /* Move focus to next field instead */
          const inputs = Array.from(form.querySelectorAll('input:not([type=hidden]), select, textarea, button[type=submit]'));
          const idx = inputs.indexOf(e.target);
          if (idx < inputs.length - 1) inputs[idx + 1].focus();
        }
      }
    });
  }

  /* ─── BOOT ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
