/**
 * Private hospitals landing page interactions.
 * Scoped to [data-custom-page="private-hospitals"] so it can run inline in the Craft site frame
 * without touching the global header/menu or leaking queries to the rest of the document.
 */
(() => {
  const root = document.querySelector('[data-custom-page]');
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];

  // Mark visible immediately for anything already in (or near) the viewport,
  // then let IntersectionObserver handle the rest.
  const revealItems = $$('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealNow(item) {
    item.classList.add('is-visible');
  }

  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealNow(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min((index % 3) * 70, 140)}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(revealNow);
  }

  const header = $('[data-header]');
  const menuButton = $('.menu-toggle');
  const mobileMenu = $('.mobile-menu');
  const heroImage = $('.hero-media img');

  function setHeaderState() {
    header?.classList.toggle('is-scrolled', window.scrollY > 30);
  }

  if (header) {
    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });
  }

  function closeMenu() {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    mobileMenu?.classList.remove('is-open');
    root.classList.remove('menu-open');
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      mobileMenu.setAttribute('aria-hidden', String(open));
      mobileMenu.classList.toggle('is-open', !open);
      root.classList.toggle('menu-open', !open);
    });

    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    const desktopViewport = window.matchMedia('(min-width: 1101px)');
    desktopViewport.addEventListener('change', (event) => {
      if (event.matches) closeMenu();
    });
  }

  if (heroImage && !reducedMotion) {
    let ticking = false;
    function moveHero() {
      const offset = Math.min(window.scrollY * 0.11, 75);
      heroImage.style.transform = `translate3d(0, ${offset}px, 0) scale(1.035)`;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (ticking || window.scrollY > window.innerHeight * 1.2) return;
      ticking = true;
      requestAnimationFrame(moveHero);
    }, { passive: true });
  }

  const typeEffects = $$('[data-type-effect]');

  typeEffects.forEach((typeEffect) => {
    const wordElement = typeEffect.querySelector('[data-type-effect-word]');
    const words = typeEffect.dataset.typeWords?.split('|').filter(Boolean) ?? [];
    if (!wordElement || words.length < 2 || reducedMotion) return;

    const startDelay = Number(typeEffect.dataset.typeStartDelay) || 1200;
    const holdDelay = Number(typeEffect.dataset.typeHoldDelay) || 1950;
    let wordIndex = Math.max(words.indexOf(wordElement.textContent), 0);
    let visibleCharacters = words[wordIndex].length;
    let deleting = true;
    let typeTimer;
    let isInView = false;
    let hasStarted = false;

    function queueTypeStep(delay) {
      window.clearTimeout(typeTimer);
      typeTimer = window.setTimeout(typeStep, delay);
    }

    function typeStep() {
      if (document.hidden || !isInView) return;

      typeEffect.classList.add('is-typing');

      if (deleting) {
        visibleCharacters = Math.max(0, visibleCharacters - 1);
        wordElement.textContent = words[wordIndex].slice(0, visibleCharacters);

        if (visibleCharacters === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          queueTypeStep(230);
        } else {
          queueTypeStep(55);
        }
        return;
      }

      visibleCharacters = Math.min(words[wordIndex].length, visibleCharacters + 1);
      wordElement.textContent = words[wordIndex].slice(0, visibleCharacters);

      if (visibleCharacters === words[wordIndex].length) {
        deleting = true;
        typeEffect.classList.remove('is-typing');
        queueTypeStep(holdDelay);
      } else {
        queueTypeStep(90);
      }
    }

    function setTypeEffectInView(inView) {
      isInView = inView;
      window.clearTimeout(typeTimer);
      if (!inView || document.hidden) return;

      queueTypeStep(hasStarted ? 500 : startDelay);
      hasStarted = true;
    }

    if ('IntersectionObserver' in window) {
      const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => setTypeEffectInView(entry.isIntersecting));
      }, { threshold: 0.35 });
      typeObserver.observe(typeEffect);
    } else {
      setTypeEffectInView(true);
    }

    document.addEventListener('visibilitychange', () => {
      window.clearTimeout(typeTimer);
      if (!document.hidden && isInView) queueTypeStep(500);
    });
  });

  const challengeReel = $('[data-challenge-reel]');
  if (challengeReel && !reducedMotion) {
    const challenges = [
      'Standing out in a competitive hospital market',
      'Filling theatre lists and maximising utilisation',
      'Driving the right mix of procedures',
      'Staying top of mind with referring GPs',
      'Attracting and retaining specialist VMOs',
      'Converting referrals into admissions',
      'Attracting and retaining nursing staff',
    ];
    const challengeFrames = [...challengeReel.querySelectorAll('[data-challenge-reel-item]')];
    const challengeCount = challengeReel.querySelector('[data-challenge-reel-count]');
    let challengeIndex = 0;
    let visibleChallengeFrame = 0;
    let challengeTimer;
    let challengeTransitionTimer;
    let challengeReelInView = false;

    function showNextChallenge() {
      const currentFrame = challengeFrames[visibleChallengeFrame];
      const nextFrameIndex = (visibleChallengeFrame + 1) % challengeFrames.length;
      const nextFrame = challengeFrames[nextFrameIndex];
      challengeIndex = (challengeIndex + 1) % challenges.length;

      window.clearTimeout(challengeTransitionTimer);
      nextFrame.classList.remove('is-active', 'is-leaving');
      nextFrame.textContent = challenges[challengeIndex];
      void nextFrame.offsetWidth;

      currentFrame.classList.remove('is-active');
      currentFrame.classList.add('is-leaving');
      nextFrame.classList.add('is-active');
      visibleChallengeFrame = nextFrameIndex;
      if (challengeCount) challengeCount.textContent = String(challengeIndex + 1).padStart(2, '0');

      challengeTransitionTimer = window.setTimeout(() => {
        currentFrame.classList.remove('is-leaving');
      }, 650);
    }

    function queueNextChallenge(delay = 3200) {
      window.clearTimeout(challengeTimer);
      challengeTimer = window.setTimeout(() => {
        if (!challengeReelInView || document.hidden) return;
        showNextChallenge();
        queueNextChallenge();
      }, delay);
    }

    if ('IntersectionObserver' in window) {
      const challengeReelObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          challengeReelInView = entry.isIntersecting;
          window.clearTimeout(challengeTimer);
          if (challengeReelInView && !document.hidden) queueNextChallenge(1500);
        });
      }, { threshold: 0.35 });
      challengeReelObserver.observe(challengeReel);
    } else {
      challengeReelInView = true;
      queueNextChallenge(1500);
    }

    document.addEventListener('visibilitychange', () => {
      window.clearTimeout(challengeTimer);
      if (!document.hidden && challengeReelInView) queueNextChallenge(700);
    });
  }

  const dividerVideo = $('[data-divider-video]');
  const dividerControl = $('[data-video-control]');
  if (dividerVideo && dividerControl) {
    const dividerSource = dividerVideo.querySelector('source[data-src]');
    let dividerInRange = false;
    let dividerUserPaused = false;
    let dividerManuallyStarted = false;

    function loadDividerVideo() {
      if (!dividerSource || dividerSource.src) return;
      dividerSource.src = dividerSource.dataset.src;
      dividerVideo.load();
    }

    function playDividerVideo() {
      if (dividerUserPaused) return;
      loadDividerVideo();
      dividerControl.setAttribute('aria-label', 'Pause video');
      dividerVideo.play().then(updateDividerControl).catch(updateDividerControl);
    }

    function updateDividerControl() {
      const isPaused = dividerVideo.paused;
      dividerControl.setAttribute('aria-label', isPaused ? 'Play video' : 'Pause video');
    }

    function toggleDividerVideo() {
      if (dividerVideo.paused) {
        dividerUserPaused = false;
        dividerManuallyStarted = true;
        playDividerVideo();
      } else {
        dividerUserPaused = true;
        dividerVideo.pause();
        updateDividerControl();
      }
    }

    if ('IntersectionObserver' in window) {
      const dividerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          dividerInRange = entry.isIntersecting;
          if (dividerInRange && !document.hidden && (!reducedMotion || dividerManuallyStarted)) playDividerVideo();
          else dividerVideo.pause();
        });
      }, { rootMargin: '350px 0px', threshold: 0.01 });

      dividerObserver.observe(dividerVideo);
    } else {
      dividerInRange = true;
      if (!reducedMotion) playDividerVideo();
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) dividerVideo.pause();
      else if (dividerInRange && (!reducedMotion || dividerManuallyStarted)) playDividerVideo();
    });

    dividerVideo.addEventListener('play', updateDividerControl);
    dividerVideo.addEventListener('pause', updateDividerControl);
    dividerControl.addEventListener('click', toggleDividerVideo);
    dividerControl.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggleDividerVideo();
    });
    updateDividerControl();
  }

  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.count);
        const started = performance.now();
        const duration = 1050;

        function update(now) {
          const progress = Math.min((now - started) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = Math.round(target * eased).toLocaleString('en-AU');
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(element);
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => countObserver.observe(counter));
  }

  const pooledGallery = $('[data-pooled-gallery]');
  if (pooledGallery && !reducedMotion) {
    const pooledFrames = [...pooledGallery.querySelectorAll('.pooled-image')];
    let pooledIndex = 0;
    let pooledTimer;
    let pooledInView = false;

    function showPooledFrame(index) {
      const nextFrame = pooledFrames[index];
      if (!nextFrame || index === pooledIndex) return;

      pooledFrames[pooledIndex].classList.remove('is-active');
      nextFrame.classList.add('is-active');
      pooledIndex = index;
      pooledGallery.dataset.galleryIndex = String(index);
    }

    function queuePooledFrame(delay = 4600) {
      window.clearTimeout(pooledTimer);
      pooledTimer = window.setTimeout(() => {
        if (!pooledInView || document.hidden) return;
        showPooledFrame((pooledIndex + 1) % pooledFrames.length);
        queuePooledFrame();
      }, delay);
    }

    if ('IntersectionObserver' in window) {
      const pooledObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          pooledInView = entry.isIntersecting;
          window.clearTimeout(pooledTimer);
          if (pooledInView && !document.hidden) queuePooledFrame(1800);
        });
      }, { threshold: 0.25 });
      pooledObserver.observe(pooledGallery);
    } else {
      pooledInView = true;
      queuePooledFrame(1800);
    }

    document.addEventListener('visibilitychange', () => {
      window.clearTimeout(pooledTimer);
      if (!document.hidden && pooledInView) queuePooledFrame(900);
    });
  }

  const workGalleries = $$('[data-work-gallery]');
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)');

  workGalleries.forEach((gallery) => {
    const card = gallery.closest('.work-item');
    const frames = [...gallery.querySelectorAll('.work-gallery-image')];
    let activeIndex = 0;
    let cycleTimer;
    let transitionTimer;

    function showFrame(index) {
      const currentFrame = frames[activeIndex];
      const nextFrame = frames[index];
      if (!nextFrame || nextFrame === currentFrame) return;

      window.clearTimeout(transitionTimer);
      frames.forEach((frame) => {
        if (frame !== currentFrame && frame !== nextFrame) {
          frame.classList.remove('is-active', 'is-leaving');
        }
      });

      currentFrame.classList.remove('is-active');
      currentFrame.classList.add('is-leaving');
      nextFrame.classList.remove('is-leaving');
      nextFrame.classList.add('is-active');

      activeIndex = index;
      gallery.dataset.galleryIndex = String(index);
      transitionTimer = window.setTimeout(() => {
        currentFrame.classList.remove('is-leaving');
      }, 1250);
    }

    function queueNextFrame(delay = 2300) {
      window.clearTimeout(cycleTimer);
      cycleTimer = window.setTimeout(() => {
        showFrame((activeIndex + 1) % frames.length);
        queueNextFrame();
      }, delay);
    }

    function startGallery({ allowWithoutHover = false } = {}) {
      if (reducedMotion || frames.length < 2 || (!allowWithoutHover && !hoverCapable.matches)) return;
      queueNextFrame(600);
    }

    function stopGallery() {
      window.clearTimeout(cycleTimer);
      cycleTimer = undefined;
      showFrame(0);
    }

    gallery.addEventListener('pointerenter', (event) => {
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      startGallery();
    });
    gallery.addEventListener('pointerleave', stopGallery);
    card?.addEventListener('focus', () => startGallery({ allowWithoutHover: true }));
    card?.addEventListener('blur', stopGallery);
    hoverCapable.addEventListener('change', stopGallery);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopGallery();
    });
  });
})();
