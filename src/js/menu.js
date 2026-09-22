let lastScrollTop = 0;
let scrollDownDistance = 0;
let scrollUpDistance = 0;
document.addEventListener(
  'scroll',
  function (e) {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
      scrollUpDistance = 0;
      scrollDownDistance += st - lastScrollTop;
      if (scrollDownDistance > 100) {
        document.querySelector('#main').classList.add('is-menu-hidden');
      }
    } else {
      scrollDownDistance = 0;
      scrollUpDistance += st - lastScrollTop;
      if (scrollUpDistance < -50) {
        document.querySelector('#main').classList.remove('is-menu-hidden');
      }
    }
    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
  },
  false
);
