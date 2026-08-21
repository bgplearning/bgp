// BGP Learning — site-wide image lightbox.
// Any <img> inside .card-thumb (or explicitly marked data-lightbox) opens
// full-screen. Fully keyboard accessible: triggers are focusable and open
// with Enter/Space; the dialog traps focus on its close button, closes on
// Escape or click, and returns focus to the image that opened it.
document.addEventListener('DOMContentLoaded', function () {
  var triggers = document.querySelectorAll('.card-thumb img, [data-lightbox]');
  if (!triggers.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close image viewer">&times;</button><img alt="">';
  document.body.appendChild(overlay);
  var overlayImg = overlay.querySelector('img');
  var closeBtn = overlay.querySelector('.lightbox-close');
  var lastFocused = null;

  function openLightbox(img) {
    lastFocused = img;
    overlayImg.src = img.currentSrc || img.src;
    overlayImg.alt = img.alt || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeLightbox() {
    overlay.classList.remove('open');
    overlayImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  triggers.forEach(function (img) {
    // Make each trigger act like a button for keyboard users.
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    var label = img.alt ? 'View larger: ' + img.alt : 'View larger image';
    img.setAttribute('aria-label', label);

    img.addEventListener('click', function (e) {
      e.stopPropagation();
      openLightbox(img);
    });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });

  overlay.addEventListener('click', closeLightbox);
  // Keep keyboard focus on the close button while the dialog is open
  // (it is the only interactive element inside the dialog).
  overlay.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      closeBtn.focus();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeLightbox();
  });
});
