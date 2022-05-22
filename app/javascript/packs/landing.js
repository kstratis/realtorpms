import 'bootstrap'  // bootstrap js files
import AOS from 'aos'; // animate on scroll lib
import { initLanguageSwitcher, initCrisp } from "./utilities";

// No Turbolinks at this point
$(document).ready(function() {
  // DEBUG
  // console.log( "Website DOM loaded" );
  // Start the animation lib
  AOS.init({
    duration: 1000,
    once: true
  });

  initLanguageSwitcher();
  const active_locale = $('#current_locale').data().i18n.locale || 'en';
  initCrisp(active_locale);
});