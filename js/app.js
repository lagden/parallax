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

var requestAF = ((function(win) {
  return win.requestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame;
}))(window);

var cancelAF = ((function(win) {
  return win.cancelAnimationFrame || win.mozCancelAnimationFrame;
}))(window);

// Mobile check
window.mobilecheck = function() {
  var a = (navigator.userAgent || navigator.vendor || window.opera);
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
};

// Ease Animation
Math.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1)
    return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

var $                 = document.querySelector.bind(document);
var docHtml           = $('html');
var docBody           = document.body || $('body');
var header            = $('body > .cd-header');
var content           = $('body > .content');
var footer            = $('body > .cd-footer');

(function(win, d) {

  var primaryNavTrigger = $('#primaryNavTrigger');
  var primaryNav        = $('#primaryNav');
  var goTop             = $('#goTop');
  var goTopRun          = false;

  content.style.marginBottom = footer.getBoundingClientRect().height + 'px';

  if (win.mobilecheck()) {
    var intro = $('#intro');
    intro.style.height = d.documentElement.clientHeight + 'px';
  }

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
        rafId = win.requestAF(animateScroll);
      else {
        win.cancelAF(rafId);
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
      win.requestAF(updateBg);
    }
  }

  function updateBg() {
    var scrollY = win.scrollY || d.documentElement.scrollTop || docBody.scrollTop;
    var relativeY = scrollY / 1000;
    var nY = pos(0, 600, relativeY, 0);
    bg.style[transformProperty] = 'translate3d(0, ' + nY + 'px, 0)';
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
  },
  active: function() {
    content.style.marginBottom = footer.getBoundingClientRect().height + 'px';
  }
};

var webfont = '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
loadJS(webfont);
