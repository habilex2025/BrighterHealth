const container = document.querySelector('.site');
const panels = document.querySelectorAll('[data-bg-color]');

document.addEventListener('scroll', function (e) {
  const scrollBottom = window.scrollY + window.innerHeight / 2;
  const bgColors = [];
  let bgColor = null;

  panels.forEach((el) => {
    const color = el.getAttribute('data-bg-color');
    bgColors.push('bg-' + color);
    if (el.offsetTop <= scrollBottom && el.offsetTop + el.offsetHeight > scrollBottom) {
      bgColor = 'bg-' + color;
    } else {
      container.classList.remove('bg-' + color);
    }
  });

  if (bgColor) {
    container.classList.add(bgColor);
  } else {
    for (let i = 0; i < bgColors.length; i++) {
      if (bgColor !== bgColors[i]) container.classList.remove(bgColors[i]);
    }
  }
});
