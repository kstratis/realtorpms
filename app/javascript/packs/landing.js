import 'bootstrap'  // bootstrap js files
import AOS from 'aos'; // animate on scroll lib
import { setCookie } from './utilities';

// No Turbolinks at this point
$(document).ready(function() {
  // DEBUG
  // console.log( "Website DOM loaded" );
  // Start the animation lib
  AOS.init({
    duration: 1000,
    once: true
  });

  $('#locale-switch-reject').on('click', (e) => {
    e.preventDefault();
    $('#language-switcher-container').hide();
    setCookie('locale_switch_dismissed','ok',2);
  })
});