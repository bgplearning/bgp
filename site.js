// BGP Learning — shared site behaviors (nav toggle, copy-citation).
// Replaces the old inline onclick handlers so the site works with a
// strict Content-Security-Policy and keeps markup clean.
document.addEventListener('DOMContentLoaded', function () {

  // ---- Mobile nav toggle ----
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('navlinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close the menu with Escape and return focus to the button.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // ---- Copy citation (work detail pages) ----
  var copyBtn = document.querySelector('[data-copy-citation]');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var src = document.getElementById(copyBtn.dataset.copyCitation);
      if (!src) return;
      // Clone the citation and strip any drafting placeholders (.todo)
      // so the copied text is clean regardless of placeholder wording.
      var clone = src.cloneNode(true);
      clone.querySelectorAll('.todo').forEach(function (el) { el.remove(); });
      var text = clone.textContent.replace(/\s+/g, ' ').trim();
      var done = function () {
        var original = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(function () { copyBtn.textContent = original; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        // Fallback for very old browsers / non-secure contexts.
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        ta.remove();
      }
    });
  }
});
