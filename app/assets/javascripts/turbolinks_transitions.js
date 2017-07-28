Turbolinks.BrowserAdapter.prototype.showProgressBarAfterDelay = function() {
  return this.progressBarTimeout = setTimeout(this.showProgressBar, 100);
};

// On each visit turbolinks swaps the document body so 'animated' and 'fadeIn'
// are automatically removed and don't add up.
// Optional
$(document).on('turbolinks:load', function(){
  $('#page-transition').addClass('animated fadeIn');
});