Turbolinks.BrowserAdapter.prototype.showProgressBarAfterDelay = function() {
  return this.progressBarTimeout = setTimeout(this.showProgressBar, 100);
};

// On each visit turbolinks swaps the document body so 'animated' and 'fadeIn'
// are automatically removed and don't add up.
// Optional
$(document).on('turbolinks:load', function(e){
  $('#page-transition').addClass('animated fadeIn');
});

$(document).on('turbolinks:before-visit', function(e){
  // window.location.pathname is the url before the new visit.
  // We need to know where we jumping from due to this: https://github.com/turbolinks/turbolinks/issues/219
  if ((['/users', '/clients', '/properties', '/favlists'].indexOf(window.location.pathname) > -1) && (window.location.href.indexOf('?') !== -1)){
    history.replaceState({ turbolinks: {} }, '');
  }
});

