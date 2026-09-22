// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// gsap.registerPlugin(ScrollTrigger);

// let currentScroll = 0;
// let isScrollingDown = true;
// let lastScrollY = window.scrollY;
// let lastTimestamp = performance.now();

// // const scrollingImageRows = document.querySelectorAll('.scrolling-images--on-scroll');
// const tween = gsap
//   .to('.scrolling-images__image', {
//     xPercent: -100,
//     repeat: -1,
//     duration: 30,
//     ease: 'linear',
//   })
//   .totalProgress(0.5);

// gsap.set('.scrolling-images--on-scroll', { xPercent: -50 });

// let speedScale = 1;

// window.addEventListener('scroll', function () {
//   if (window.pageYOffset > currentScroll) {
//     isScrollingDown = true;
//   } else {
//     isScrollingDown = false;
//   }
//   isScrollingDown = true;

//   const scrollY = window.scrollY;
//   const timestamp = performance.now();
//   const timeElapsed = timestamp - lastTimestamp;
//   let speedMultiplier = 1;

//   if (timeElapsed > 0) {
//     const scrollDistance = Math.abs(scrollY - lastScrollY);
//     const scrollSpeed = scrollDistance / timeElapsed;
//     speedMultiplier = 1 + scrollSpeed * 20;
//     lastScrollY = scrollY;
//     lastTimestamp = timestamp;
//   }

//   speedScale = speedMultiplier * (isScrollingDown ? 1 : -1);

//   gsap.to(tween, {
//     timeScale: speedScale,
//   });

//   currentScroll = window.pageYOffset;
// });

// window.setInterval(function () {
//   if (lastTimestamp < performance.now() - 500 && speedScale > 1) {
//     speedScale -= 4;
//     if (speedScale < 1) speedScale = 1;
//     gsap.to(tween, {
//       timeScale: speedScale,
//     });
//   }
// }, 100);
