require("turbolinks").start();

// ---
// This is a small trick to allow us the use of animating the progress bar
Turbolinks.BrowserAdapter.prototype.showProgressBarAfterDelay = function() {
  return this.progressBarTimeout = setTimeout(this.showProgressBar, 100);
};

// On each visit turbolinks swaps the document body so 'animated' and 'fadeIn'
// are automatically removed and don't add up.
// Optional
// $(document).on('turbolinks:load', function(e){
//   $('#page-transition').addClass('animate__animated animate__fadeIn');
// });

$(document).on('turbolinks:before-visit', function(e){
  // window.location.pathname is the url before the new visit.
  // We need to know where we jumping from due to this: https://github.com/turbolinks/turbolinks/issues/219
  if ((['/users', '/clients', '/properties', '/favlists'].indexOf(window.location.pathname) > -1) && (window.location.href.indexOf('?') !== -1)){
    history.replaceState({ turbolinks: {} }, '');
  }
});

$('document').ready(function() {
  $('button.close').on('click', function(){
    $('.alert').alert('close');
  })
});

// After an ajax action a given button may either rewind history by 1
// or return to a generic screen of our selection
jQuery.fn.returnOnClick = function(location) {
  $(this).on('click', function(e) {
    e.preventDefault();
    history.length === 2 ? Turbolinks.visit(location, { action: 'advance' }) : history.go(-1);
  });
  return this;
};