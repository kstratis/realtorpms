// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//

//= require jquery3
//= require jquery_ujs
//= require turbolinks
//= require turbolinks_transitions
//= require turbolinks_flash
//= require popper
//= require bootstrap
//= require parsley
//= require clamp-js-main
//= require tooltips
//= require stacked-menu/dist/js/stacked-menu.js
//= require stacked-menu/dist/js/stacked-menu.jquery.js
//= require_tree .



// After an ajax action a given button may either rewind history by 1
// or return to a generic screen of our selection
jQuery.fn.returnOnClick = function(location) {
  $(this).on('click', function(e) {
    e.preventDefault();
    history.length === 2 ? Turbolinks.visit(location, { action: 'advance' }) : history.go(-1);
  });
  return this;
};