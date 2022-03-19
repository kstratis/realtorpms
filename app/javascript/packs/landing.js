import 'bootstrap'  // bootstrap js files
import AOS from 'aos'; // animate on scroll lib
import { initLanguageSwitcher } from "./utilities";

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

  import(/* webpackIgnore: true */ 'https://cdn.paddle.com/paddle/paddle.js').then(()=>{
    // Sandbox setup
    Paddle.Environment.set('sandbox');
    Paddle.Setup({ vendor: 5206 });
    // Production setup
    // Paddle.Setup({ vendor: 1234567 });
    // Paddle.Checkout.open({ product: 12345 });
  });
});