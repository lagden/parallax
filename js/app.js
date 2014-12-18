var docBody = document.body || document.querySelector('body');
var primaryNavTrigger = document.querySelector('#primaryNavTrigger');
var primaryNav = document.querySelector('#primaryNav');

primaryNavTrigger.addEventListener('click', function(ev) {
  var m = this.checked ? 'add' : 'remove';
  primaryNav.classList[m]('cd-primary-nav--open');
  docBody.classList[m]('overflow-hidden');
}, false);