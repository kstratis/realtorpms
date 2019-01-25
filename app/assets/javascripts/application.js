// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//xw
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
//= require sweetalert2
//= require sweet-alert2-rails
//= require jquery.validate
//= require clamp
//= require tooltips
//= require stacked-menu/dist/js/stacked-menu.js
//= require stacked-menu/dist/js/stacked-menu.jquery.js
//= require_tree .

// $(document).on('turbolinks:load', function(e) {
//   console.log('running sdfsdf');
//
//   var placeholders = $('.placeholder');
//   var smalls = $('.img-small');
//   // var placeholder = document.querySelector('.placeholder'),
//   //   small = placeholder.querySelector('.img-small');
//
//   // console.log(placeholder);
//   // 1: load small image and show it
//   smalls.each(function(index, small){
//     var img = new Image();
//     img.src = small.src;
//     img.onload = function () {
//       small.classList.add('loaded');
//     };
//   });
//
//
//   placeholders.each(function(index, placeholder){
//     var imgLarge = new Image();
//     imgLarge.src = placeholder.dataset.large;
//     imgLarge.onload = function () {
//       imgLarge.classList.add('loaded');
//     };
//     placeholder.appendChild(imgLarge);
//   });
//   // 2: load large image
//
// });