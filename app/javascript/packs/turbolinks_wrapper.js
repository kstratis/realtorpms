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

// We need this to build a regex from a regular string in
// `preprocess_url_for_substitution`
RegExp.escape_fw_slash = function(string) {
  return string.replace(/[\/]/g, '\\$&')
};

function preprocess_url_for_substitution(url){
 return url.replace("id", "\\d+")
}

function check_conditions_for_turbo_nav(affected_page){
  let regex = new RegExp(affected_page, 'g');
  return (affected_page === window.location.pathname) && (window.location.href.indexOf('?') !== -1) ||
    window.location.pathname.match(regex)
}

$(document).on('turbolinks:before-visit', function(e){
  const favlist_path = preprocess_url_for_substitution($('#favlist-path').text());
  // Paths defined at app/views/layouts/_routes.html.erb
  const affected_pages = [
    $('#users-list-path').text(),
    $('#clients-list-path').text(),
    $('#properties-list-path').text(),
    $('#favlists-list-path').text(),
    favlist_path
  ].filter(() => true);
  // window.location.pathname is the url before the new visit.
  // We need to know where we jumping from due to this: https://github.com/turbolinks/turbolinks/issues/219
  affected_pages.some((affected_page)=>{
    if (check_conditions_for_turbo_nav(affected_page)){
      history.replaceState({ turbolinks: {} }, '');
      return true;
    }
  });
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