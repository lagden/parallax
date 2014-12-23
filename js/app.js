function loadJS(file, callback) {
  var h, s, d = document;
  h = d.head || d.getElementsByTagName('head')[0];
  s = d.createElement('script');
  s.src = file;
  s.type = 'text/javascript';
  s.async = true;
  if (s.readyState) {
    s.onreadystatechange = function() {
      if (s.readyState === 'loaded' || s.readyState === 'complete') {
        s.onreadystatechange = null;
        if (callback)
          callback();
      }
    };
  } else {
    s.onload = function() {
      if (callback)
        callback();
    };
  }
  h.appendChild(s);
}

// shim layer with setTimeout fallback
window.raf = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

(function(win, d) {

  var $ = d.querySelector.bind(d);
  var docHtml = $('html');
  var docBody = d.body || $('body');
  var header = $('body > .cd-header');
  var primaryNavTrigger = $('#primaryNavTrigger');
  var primaryNav = $('#primaryNav');
  var intro = $('#intro');
  var goTop = $('#goTop');
  var goTopRun = false;

  intro.style.height = d.documentElement.clientHeight + 'px';

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
      rafId;

    duration = duration || 500;

    function animateScroll() {
      currentTime += increment;
      var val = Math.easeInOutQuad(currentTime, start, change, duration);
      docBody.scrollTop = val;

      if (currentTime < duration)
        rafId = win.raf(animateScroll);
      else {
        cancelAnimationFrame(rafId);
        if (callback)
          callback();
      }
    }

    animateScroll();
  };

  // Handler Scroll the Top
  var scrollTheTop = function(ev) {
    var scrollY = win.scrollY || d.documentElement.scrollTop || docBody.scrollTop;
    if (scrollY > 10) {
      if (goTop.classList.contains('cd-is-visible') === false)
        goTop.classList.add('cd-is-visible');
    } else
      goTop.classList.remove('cd-is-visible');
  }

  // Handler Scroll Go to the Top
  var scrollGoToTheTop = function(ev) {
    ev.preventDefault();

    if (goTopRun === false) {
      goTopRun = true;
      scrollToAnimated(0, function() {
        goTopRun = false;
      });
    }
  }

  // Handler Menu
  var primaryMenu = function(ev) {
    var m = this.checked ? 'add' : 'remove';
    primaryNav.classList[m]('cd-primary-nav--open');
    docHtml.classList[m]('menu-open');
    docBody.classList[m]('menu-open');
    header.classList[m]('menu-open');
  }

  // Listener Scroll Go to the Top
  goTop.addEventListener('click', scrollGoToTheTop, false);

  // Listener Menu
  primaryNavTrigger.addEventListener('click', primaryMenu, false);

  // Parallax
  function getStyleProperty(propName) {
    var prefixes = 'Webkit Moz ms Ms O'.split(' ');
    var docElemStyle = d.documentElement.style;

    if (!propName)
      return;

    if (typeof docElemStyle[propName] === 'string')
      return propName;

    propName = propName.charAt(0).toUpperCase() + propName.slice(1);

    var prefixed;
    for (var i = 0, len = prefixes.length; i < len; i++) {
      prefixed = prefixes[i] + propName;
      if (typeof docElemStyle[prefixed] === 'string')
        return prefixed;
    }
  }

  function pos(base, range, relY, offset) {
    return base + limit(0, 1, relY - offset) * range;
  }

  function limit(min, max, value) {
    return Math.max(min, Math.min(max, value));
  }

  var bg = $('#intro > .cd-bg-cover');
  var ticking = false;
  var transformProperty = getStyleProperty('transform');

  function onResize() {
    updateBg();
  }

  function onScroll(evt) {
    if (!ticking) {
      ticking = true;
      win.raf(updateBg);
    }
  }

  function updateBg() {
    var scrollY = win.scrollY || d.documentElement.scrollTop || docBody.scrollTop;
    var relativeY = scrollY / 3000;
    bg.style[transformProperty] = 'translate3d(0, ' + pos(0, 600, relativeY, 0) + 'px, 0)';
    ticking = false;
  }

  // Events
  function scrollEvents(ev) {
    scrollTheTop();
    onScroll();
  }

  // Listener Parallax and The Top
  win.addEventListener('scroll', scrollEvents, false);

  // Listener Window Resize
  win.addEventListener('resize', onResize, false);

})(window, document);

var WebFontConfig = {
  google: {
    families: ['Damion::latin', 'Roboto+Slab::latin']
  }
};

var webfont = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
loadJS(webfont);