require("particles.js");
const particles_data = require("./particles.json");

$(document).on('turbolinks:load', function(e) {
  if (window.location.pathname === '/login') {
    particlesJS('auth-header', particles_data);
  }
});