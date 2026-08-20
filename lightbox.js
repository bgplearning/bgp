// BGP Learning — site-wide image lightbox.
// Any <img> inside .card-thumb (or explicitly marked data-lightbox) opens
// full-screen on click. Click anywhere or press Escape to close.
document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img alt="">';
  document.body.appendChild(overlay);
  var overlayImg = overlay.querySelector('img');

  function openLightbox(src, alt) {
    overlayImg.src = src;
    overlayImg.alt = alt || '';
    overlay.classList.add('open');
  }
  function closeLightbox() {
    overlay.classList.remove('open');
    overlayImg.src = '';
  }

  document.querySelectorAll('.card-thumb img, [data-lightbox]').forEach(function (img) {
    img.addEventListener('click', function (e) {
      e.stopPropagation();
      openLightbox(img.src, img.alt);
    });
  });

  overlay.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
});
