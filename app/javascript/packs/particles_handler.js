require('particles.js');
const particles_data = require('./particles.json');

$(document).on('turbolinks:load', function(e) {
  if ($('.auth-header').length < 1) return;
  particlesJS('auth-header', particles_data);
});