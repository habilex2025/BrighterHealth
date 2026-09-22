document.addEventListener('DOMContentLoaded', () => {
  // watch video
  document.querySelectorAll('.video-placeholder .video-placeholder__thumbnail').forEach((el) => {
    el.addEventListener('click', (e) => {
      const isHosted = el.getAttribute('data-hosted') === 'true' ?? false;
      el.nextElementSibling.hidden = false;
      if (isHosted) {
        el.nextElementSibling.play();
      } else {
        el.nextElementSibling.removeAttribute('srcdoc');
      }
      if (el.querySelector('.video-placeholder__play')) {
        el.querySelector('.video-placeholder__play').remove();
      }
      el.classList.add('video-placeholder__thumbnail--playing');
      return false;
    });
  });
});
