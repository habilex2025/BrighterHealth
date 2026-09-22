// Init swiper for mobile
// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
// import 'swiper/css/navigation';

window.addEventListener('DOMContentLoaded', (event) => {
  var peopleLabels = document.querySelector('.js-people-labels');

  if (peopleLabels) {
    function getLabel(personName) {
      return document.querySelector('.js-person-label[data-person="' + personName + '"]');
    }

    function getPersonPng(personName) {
      return document.querySelector('.js-person-png[data-person="' + personName + '"]');
    }

    function showLabel(personName) {
      // Get label el
      const label = getLabel(personName);

      if (label) {
        // Add visible class
        label.classList.add('visible');
        clearLabelTimeouts(personName);
      }

      highlightPerson(personName);
    }

    function hideLabel(personName) {
      // Get label el
      const label = getLabel(personName);

      if (label) {
        // Remove visible class
        label.classList.remove('visible');
        clearLabelTimeouts(personName);
      }

      unHighlightPerson(personName);
    }

    // Adds timeoutID to the label element so we can clear it if needed
    function addLabelTimeout(personName, timeoutID) {
      const label = getLabel(personName);

      if (label) {
        // Get data attr
        if ('timeouts' in label.dataset) {
          const timeoutsData = label.dataset.timeouts;

          // If it's empty, just put our ID in there
          if (!timeoutsData) {
            label.dataset.timeouts = timeoutID;
          }
          // Otherwise, grab value(s) and add to it
          else {
            // Get values as array
            const timeouts = timeoutsData.split(',');

            // Add this ID to the array
            timeouts.push(timeoutID);

            // Put it back in the data attr as a string
            label.dataset.timeouts = timeouts.toString();
          }
        }
      }
    }

    // Clears all timeouts from the label's data attribute
    function clearLabelTimeouts(personName) {
      const label = getLabel(personName);

      if (label) {
        // Get data attr
        const timeoutsData = label.dataset.timeouts;

        if (timeoutsData) {
          // Get values as array
          const timeouts = timeoutsData.split(',');

          for (let j = 0; j < timeouts.length; j++) {
            const timeoutID = timeouts[j];
            clearTimeout(timeoutID);
          }
        }

        label.dataset.timeouts = '';
      }
    }

    function highlightPerson(personName) {
      const personPng = getPersonPng(personName);

      if (personPng) {
        personPng.classList.add('visible');
      }
      checkHighlightedPeople();
    }

    function unHighlightPerson(personName) {
      const personPng = getPersonPng(personName);

      if (personPng) {
        personPng.classList.remove('visible');
      }
      checkHighlightedPeople();
    }

    function checkHighlightedPeople() {
      const peopleHighlightsCont = document.querySelector('.js-people-highlights');
      const teamPhoto = document.querySelector('.js-team-photo');

      if (peopleHighlightsCont && teamPhoto) {
        const visibleCount = peopleHighlightsCont.querySelectorAll('.js-person-png.visible').length;

        if (visibleCount > 0) {
          teamPhoto.classList.add('faded');
        } else {
          teamPhoto.classList.remove('faded');
        }
      }
    }

    function slideToPerson(personName) {
      // Get slide
      const slide = document.querySelector('.person-name-slide[data-person="' + personName + '"]');

      if (slide) {
        const slides = peopleNamesSwiper.slides;

        let index = null;

        // Get index by looping through swiper instance
        for (let i = 0; i < slides.length; i++) {
          const slide = slides[i];

          if (slide.attributes.getNamedItem('data-person').nodeValue === personName) {
            index = i;
            break;
          }
        }

        if (index !== null) {
          // Slide to index
          peopleNamesSwiper.slideTo(index);
        }
      }
    }

    // Get targets
    const peopleTargets = document.querySelectorAll('.js-people-target');
    const labelTimeout = 500; // ms
    const mql = window.matchMedia('(max-width: 999px)');

    // Add event listeners to each target
    if (peopleTargets) {
      for (let i = 0; i < peopleTargets.length; i++) {
        const target = peopleTargets[i];
        const personName = target.dataset.person;

        if (personName) {
          target.addEventListener('mouseover', function () {
            if (!mql.matches) {
              showLabel(personName);
            }
          });

          target.addEventListener('mouseleave', function () {
            if (!mql.matches) {
              const timeoutID = setTimeout(() => {
                hideLabel(personName);
              }, labelTimeout);
              addLabelTimeout(personName, timeoutID);
            }
          });

          target.addEventListener('click', function (e) {
            if (mql.matches) {
              slideToPerson(personName);
            }
          });
        }
      }
    }

    // Get labels
    var peopleLabels = document.querySelectorAll('.js-person-label');

    // Add event listeners to each label
    if (peopleLabels) {
      for (let i = 0; i < peopleLabels.length; i++) {
        const label = peopleLabels[i];
        const personName = label.dataset.person;

        if (label) {
          label.addEventListener('mouseover', function () {
            if (!mql.matches) {
              showLabel(personName);
            }
          });
          label.addEventListener('focus', function () {
            if (!mql.matches) {
              showLabel(personName);
            }
          });

          label.addEventListener('mouseleave', function () {
            if (!mql.matches) {
              const timeoutID = setTimeout(() => {
                hideLabel(personName);
              }, labelTimeout);
              addLabelTimeout(personName, timeoutID);
            }
          });
          label.addEventListener('blur', function () {
            if (!mql.matches) {
              const timeoutID = setTimeout(() => {
                hideLabel(personName);
              }, labelTimeout);
              addLabelTimeout(personName, timeoutID);
            }
          });
          label.addEventListener('click', function () {
            if (mql.matches) {
              slideToPerson(personName);
            }
          });
        }
      }
    }

    // init Swiper:
    const peopleNamesSwiper = new Swiper('.people-names-swiper', {
      // configure Swiper to use modules
      modules: [Navigation],
      direction: 'horizontal',
      loop: false,
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      slidesPerView: 2,
      centeredSlides: true,
      slideToClickedSlide: true,
      initialSlide: 3,
      spaceBetween: 10,
      breakpoints: {
        500: {
          slidesPerView: 2.5,
        },
        580: {
          slidesPerView: 3,
        },
      },
      on: {
        init: function () {
          if (mql.matches) {
            // Get active slide & show corresponding label
            const activePersonName = this.slides[this.activeIndex].dataset.person;
            showLabel(activePersonName);
          }
        },
      },
    });

    peopleNamesSwiper.on('slideChange', function () {
      if (mql.matches) {
        // Get active slide & show corresponding label
        const activePersonName = this.slides[this.activeIndex].dataset.person;
        showLabel(activePersonName);

        // Get previous slide & hide corresponding label
        const prevPersonName = this.slides[this.previousIndex].dataset.person;
        hideLabel(prevPersonName);
      }
    });
  }
});
