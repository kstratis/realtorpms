import 'bootstrap'  // bootstrap js files
import AOS from 'aos'; // animate on scroll lib

// No Turbolinks at this point
$(document).ready(function() {
  console.log( "Website DOM loaded" );
  // Start the animation lib
  AOS.init({
    duration: 1000,
    once: true
  })
});