var docBody = document.body || document.querySelector('body');
var primaryNavTrigger = document.querySelector('#primaryNavTrigger');
var primaryNav = document.querySelector('#primaryNav');
var goTop = document.querySelector('#goTop');

// Ease Animation
Math.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t * t + b;
  }
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

// Scroll To
var scrollToAnimated = function(to, callback, duration) {
  var scrollY = docBody.scrollTop,
      start = scrollY,
      change = to - start,
      currentTime = 0,
      increment = 20,
      raf;

  duration = duration || 1000;

  function animateScroll() {
    currentTime += increment;
    var val = Math.easeInOutQuad(currentTime, start, change, duration);
    docBody.scrollTop = val;

    if (currentTime < duration)
      raf = window.requestAnimationFrame(animateScroll);
    else {
      cancelAnimationFrame(raf);
      if (callback)
        callback();
    }
  }

  animateScroll();
};

// Handler Scroll the Top
var scrollTheTop = function(ev) {
  var scrollY = window.scrollY || document.documentElement.scrollTop || docBody.scrollTop;
  if (scrollY > 10) {
    if (goTop.classList.contains('cd-is-visible') === false)
      goTop.classList.add('cd-is-visible');
  } else
    goTop.classList.remove('cd-is-visible');
}

// Handler Scroll Go to the Top
var scrollGoToTheTop = function(ev) {
  ev.preventDefault();
  console.log('anima');
  scrollToAnimated(0);
}

// Handler Menu
var primaryMenu = function(ev) {
  var m = this.checked ? 'add' : 'remove';
  primaryNav.classList[m]('cd-primary-nav--open');
  docBody.classList[m]('overflow-hidden');
}

// Listener Scroll Top
window.addEventListener('scroll', scrollTheTop, false);

// Listener Scroll Go to the Top
goTop.addEventListener('click', scrollGoToTheTop, false);

// Listener Menu
primaryNavTrigger.addEventListener('click', primaryMenu, false);