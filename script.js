'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const learnMoreBtn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContents = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const lazyImages = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btnEL => btnEL.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

learnMoreBtn.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

navLinks.addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

tabsContainer.addEventListener('click', e => {
  const currentBtn = e.target.closest('button');
  if (!currentBtn) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  currentBtn.classList.add('operations__tab--active');

  tabsContents.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active')
  );

  document
    .querySelector(`.operations__content--${currentBtn.dataset.tab}`)
    .classList.add('operations__content--active');
});

//nav hover
const navHoverFunc = (e, opacity) => {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });

    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', e => navHoverFunc(e, 0.5));

nav.addEventListener('mouseout', e => navHoverFunc(e, 1));

const navHeight = nav.getBoundingClientRect().height;

console.log(navHeight);
const stickyNav = entries => {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const observerNav = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

observerNav.observe(header);

//reveal
const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const observerSection = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});
sections.forEach(section => {
  section.classList.add('section--hidden');
  observerSection.observe(section);
});

// const slc1 = document.querySelectorAll('[data-src="img/card.jpg"]'); works for only one
// const slc2 = document.querySelectorAll('img[data-src]'); works for all element which have data-src attribute in img tag
// console.log(slc1, slc2);

// console.log(lazyImages);

const revealImg = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(revealImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
lazyImages.forEach(img => imgObserver.observe(img));

//sliders

const createDots = () => {
  slides.forEach((_, i) => {
    const button = `<button class="dots__dot" data-slide="${i}"></button>`;
    dotContainer.insertAdjacentHTML('beforeend', button);
  });
};

const activateDots = curSlide => {
  const btns = document.querySelectorAll('.dots__dot');
  btns.forEach(btn => {
    btn.classList.remove('dots__dot--active');
    document
      .querySelector(`[data-slide='${curSlide}']`)
      .classList.add('dots__dot--active');
  });
};

let curSlide = 0;
const maxLength = slides.length - 1;

slides.forEach((s, i) => (s.style.transform = `translateX(${i * 100}%)`)); // 0% 100% 200% 300%

const goToSlide = curSlide => {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - curSlide) * 100}%)`;
    console.log(i, curSlide);
  }); // <== -100% 0% 100% 200%
};

const init = () => {
  activateDots(0);
  createDots();
  goToSlide(0);
};

init();

const previousSlide = () => {
  if (curSlide === 0) {
    curSlide = maxLength;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDots(curSlide);
};

const nextSlide = () => {
  if (curSlide === maxLength) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDots(curSlide);
};

dotContainer.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDots(slide);
  }
});

btnLeft.addEventListener('click', previousSlide);
btnRight.addEventListener('click', nextSlide);

document.addEventListener('keyup', e => {
  e.key === 'ArrowLeft' && previousSlide();
  e.key === 'ArrowRight' && nextSlide();
});
