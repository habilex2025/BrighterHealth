import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// showreel video expands
const showreel = document.querySelector('.showreel');
gsap.from(showreel, {
  scale: 0.75,
  scrollTrigger: {
    trigger: showreel,
    start: 'top center',
    end: '65% center',
    scrub: true,
    markers: false,
  },
});

const showreelOuter = document.querySelector('.showreel-outer');
gsap.to(showreelOuter, {
  y: 40,
  scrollTrigger: {
    trigger: showreelOuter,
    start: '25% center',
    end: '100% center',
    scrub: true,
    markers: false,
  },
});
// gsap.to(showreel, {
//   scale: 1.25,
//   scrollTrigger: {
//     trigger: showreel,
//     start: 'top center',
//     end: '65% center',
//     scrub: true,
//     markers: false,
//   },
// });

// cards float up
const cards = document.querySelectorAll('.card .card__inner');
cards.forEach((card) => {
  const initialY = parseFloat(card.parentElement.getAttribute('data-y') ?? 100);
  gsap.fromTo(
    card,
    { opacity: 1, y: initialY },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: card,
        start: 'top bottom-=100',
        end: 'bottom center',
        scrub: true,
        markers: false,
      },
    }
  );
});

// cards float up
const bubbleLists = document.querySelectorAll('.bubble-list');
bubbleLists.forEach((bubbleList) => {
  const items = bubbleList.querySelectorAll('.bubble-list__item');
  const shuffledItems = Array.from(items).sort(() => Math.random() - 0.5);
  shuffledItems.forEach((item, index) => {
    gsap.from(item, {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: index * 0.2,
      scrollTrigger: {
        trigger: item,
        start: 'top bottom-=100',
        end: 'bottom center',
        scrub: true,
        markers: false,
      },
    });
  });
});

// float from left/right
const slideInItems = document.querySelectorAll('.anim-slide-in');
slideInItems.forEach((item) => {
  const from = item.getAttribute('data-from') ?? 'bottom';
  const delay = 100 + parseFloat(item.getAttribute('data-delay') ?? 0);
  let fromX = 0;
  let fromY = 0;
  if (from === 'left') fromX = -100;
  if (from === 'right') fromX = 100;
  if (from === 'bottom') fromY = 100;
  gsap.from(item, {
    opacity: 0,
    x: fromX,
    y: fromY,
    delay,
    duration: 1,
    scrollTrigger: {
      trigger: item,
      start: 'top bottom-=' + delay,
      end: 'bottom center',
      scrub: true,
      markers: false,
    },
  });
});

// slide in quickly
const quickSlideInItems = document.querySelectorAll('.anim-quick-slide-in');
quickSlideInItems.forEach((item) => {
  const from = item.getAttribute('data-from') ?? 'bottom';
  let fromX = 0;
  let fromY = 0;
  if (from === 'left') fromX = -100;
  if (from === 'right') fromX = 100;
  if (from === 'bottom') fromY = 100;
  gsap.from(item, {
    // opacity: 0,
    x: fromX,
    y: fromY,
    duration: 0.4,
    scrollTrigger: {
      trigger: item,
      start: 'top bottom-=100',
      end: '60% center',
      scrub: true,
      markers: false,
    },
  });
  gsap.from(item, {
    opacity: 0,
    duration: 0.4,
    scrollTrigger: {
      trigger: item,
      start: 'top bottom-=100',
      end: '25% center',
      scrub: true,
      markers: false,
    },
  });
});

// const scrollingImageRows = document.querySelectorAll('.scrolling-images--on-scroll');
// const xStart = [];
// const xFinish = [];
// scrollingImageRows.forEach((scrollingImageRow, i) => {
//   xStart[i] = -100;
//   xFinish[i] = 50;
//   if (scrollingImageRow.classList.contains('scrolling-images--dir-right')) {
//     xStart[i] = 50;
//     xFinish[i] = -100;
//   }
//   console.log(xStart);
//   gsap.fromTo(
//     scrollingImageRow,
//     { xPercent: xStart[i] },
//     {
//       xPercent: xFinish[i],
//       // duration: 1,
//       scrollTrigger: {
//         trigger: scrollingImageRow,
//         start: 'top 72%',
//         end: 'bottom top',
//         scrub: true,
//       },
//     }
//   );
//   // gsap.to(scrollingImageRow, {
//   //   xPercent: 100,
//   //   ease: 'none',
//   //   scrollTrigger: {
//   //     trigger: scrollingImageRow,
//   //     start: 'top bottom',
//   //     end: 'bottom top',
//   //     scrub: true,
//   //   },
//   // });
// });

const scrollingImageRows = document.querySelectorAll('.scrolling-images-container');
scrollingImageRows.forEach((el, i) => {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    const trackOuter = el.querySelector('.scrolling-images-wrapper');
    const track = el.querySelector('.scrolling-images');
    const trackWidth = track.offsetWidth;
    // const trackHeight = track.offsetHeight;
    const startX = trackWidth * -1;
    const endX = 0;

    const elTop = el.offsetTop;
    const elHeight = el.offsetHeight;
    const screenBottom = scrollTop + windowHeight;
    const elBottom = elTop + elHeight;
    let scrollPercentage;
    if (screenBottom <= elTop) {
      scrollPercentage = 0;
    } else {
      scrollPercentage = ((screenBottom - elTop) / elHeight) * 100;
    }
    console.log('scrollPercentage', scrollPercentage);

    const rangeX = endX - startX;
    const posX = (rangeX / 100) * scrollPercentage;

    if (scrollTop >= elTop && screenBottom < elBottom) trackOuter.classList.add('is-scrolling');
    else trackOuter.classList.remove('is-scrolling');

    if (screenBottom >= elBottom) trackOuter.classList.add('is-scrolled');
    else trackOuter.classList.remove('is-scrolled');

    if (windowWidth >= 1000) track.style.transform = `translateX(${posX}px)`;
    else track.style.transform = `translateX(0)`;
  });
});

// float from left/right
const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
if (windowWidth < 1000) {
  const slideInItems = document.querySelectorAll('.scrolling-images__image');
  slideInItems.forEach((item) => {
    const from = item.getAttribute('data-from') ?? 'bottom';
    const delay = 100 + parseFloat(item.getAttribute('data-delay') ?? 0);
    let fromX = 0;
    let fromY = 0;
    if (from === 'left') fromX = -100;
    if (from === 'right') fromX = 100;
    if (from === 'bottom') fromY = 100;
    gsap.from(item, {
      opacity: 0,
      x: fromX,
      y: fromY,
      delay,
      duration: 1,
      scrollTrigger: {
        trigger: item,
        start: 'top bottom-=' + delay,
        end: 'bottom center',
        scrub: true,
        markers: false,
      },
    });
  });
}
