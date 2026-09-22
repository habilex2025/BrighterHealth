const subnav = document.querySelector('.sub-nav');
if (subnav) {
  const subnavOffsetTop = subnav.offsetTop - 28;
  document.addEventListener('scroll', function (e) {
    let offsetTop = subnavOffsetTop;
    if (!document.querySelector('#main').classList.contains('is-menu-hidden'))
      offsetTop -= document.querySelector('.site-header').offsetHeight;
    if (window.scrollY > offsetTop) {
      document.querySelector('#main').classList.add('is-sub-nav-fixed');
    } else {
      document.querySelector('#main').classList.remove('is-sub-nav-fixed');
    }
  });

  document.addEventListener('scroll', function () {
    const markers = document.querySelectorAll('.marker');
    let activeMarker = null;

    markers.forEach((marker) => {
      const bounds = marker.getBoundingClientRect();

      console.log(bounds.top, window.innerHeight * 0.1);

      const markerLink = document.querySelector('[data-id="' + marker.id + '"]');

      markerLink.classList.remove('sub-nav__link--active');

      // Check if the marker is within 10% of the viewport height from the top
      if (bounds.top <= window.innerHeight * 0.1) {
        activeMarker = marker.id;
        // markerLink.classList.add('sub-nav__link--active');
      } else {
        // markerLink.classList.remove('sub-nav__link--active');
      }
    });

    const markerLink = document.querySelector('[data-id="' + activeMarker + '"]');
    markerLink.classList.add('sub-nav__link--active');
  });
}
