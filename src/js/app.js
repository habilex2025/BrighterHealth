import 'alpinejs';
import objectFitImages from 'object-fit-images';

import inView from './in-view';
import './animations';
import './menu';
import './bg-fade';
import './sub-nav';
import './video';
import './people-labels';
import './scrolling-images';

objectFitImages();

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Initialize aria visibility toggles.
   *
   * Usage:
   *    <button aria-expanded="false" aria-controls="myDropdown">Toggle</button>
   *    <div id="myDropdown" aria-hidden="true">Dropdown</div>
   */
  document.querySelectorAll('[aria-controls]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const id = el.getAttribute('aria-controls');
      const controlled = document.getElementById(id);
      const open = controlled.getAttribute('aria-hidden') !== 'false';

      controlled.setAttribute('aria-hidden', open ? 'false' : 'true');

      document.querySelectorAll(`[aria-controls="${id}"]`).forEach((el) => {
        el.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      e.preventDefault();
    });
  });

  /**
   * Lazy loading fallback
   * Native loading="lazy" images already have a real src — only promote data-src/data-srcset
   * when those attributes are present. (Checking !== 'undefined' is wrong: missing dataset
   * values are the undefined primitive, so that condition is always true and overwrites src.)
   */
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      if (img.dataset.src) img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.classList.remove('blur-up');
      img.classList.remove('lazyload');
    });
  } else {
    // Dynamically import the LazySizes library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.1.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

  /**
   * Block links
   */
  document.querySelectorAll('.block-link').forEach((el) => {
    el.addEventListener('click', function (e) {
      el.querySelector('a').click();
    });
  });

  // -------------
  // In view
  // https://github.com/camwiegert/in-view
  // -------------
  inView.threshold(0.5); // 50% of element must be visible to trigger

  // adds 'visible' class once when it becomes visible
  inView('.iv-once').on('enter', (el) => {
    el.classList.add('visible');
  });

  inView('.iv-once-children > *').on('enter', (el) => {
    el.classList.add('visible');
  });

  // adds 'visible' class when it becomes visible, then removes class when it stops being visible
  inView('.iv-repeat')
    .on('enter', (el) => {
      el.classList.add('visible');
    })
    .on('exit', (el) => {
      el.classList.remove('visible');
    });
});
