import { Application } from '@hotwired/stimulus';
import { definitionsFromContext } from '@hotwired/stimulus-webpack-helpers';


require("@rails/ujs").start();
import './turbolinks_wrapper';
import bootbox from "bootbox";
import { initLanguageSwitcher } from "./utilities";
// STIMULUS BOOTSTRAPPING
const application = Application.start();
const context = require.context('../controllers', true, /\.js$/);
application.load(definitionsFromContext(context));
// END OF STIMULUS BOOTSTRAPPING

$(document).on('turbolinks:load', function(e) {
  // Initialize carousel elements via `Splide`
  // `Splide` is loaded directly via jsdelivr in skeleton.html.erb
  initCarousels();
  initLanguageSwitcher();

  // Initialize any bootbox modals
  const translation = JSON.parse(document.getElementById('nav_i18n').dataset.navi18n);
  $('#about').on('click', (e) => {
    e.preventDefault();
    bootbox.alert({
      title: translation['about']['title'],
      message: `<div class='text-center'><p><i><strong>${translation['about']['description']}</strong></i></p></div>`,
      backdrop: true,
      closeButton: false,
      centerVertical: true,
    })
  })

  $('#contact').on('click', (e) => {
    e.preventDefault();
    bootbox.alert({
      title: translation['contact']['title'],
      message: `<div class="text-center">
                  <p><strong><a href='mailto:${translation['contact']['email']}'>${translation['contact']['email']}</a></strong></p>
                  <p ><span class='highlighted-bg p-3'>${translation['contact']['telephones_html']}</span></p>
                </div>`,
      backdrop: true,
      closeButton: false,
      centerVertical: true,
    })
  })
});

function initCarousels() {
  const slideElements = $('.splide').not('#splide-gallery');
  slideElements.each((_, slideElement) => {
    new window.Splide(slideElement, { type: 'loop', lazyLoad: 'nearby'}).mount();
  });

  if ($('#splide-gallery').length === 0) return;

  var splide = new window.Splide('#splide-gallery', { type: 'loop', pagination: false });
  var images = $('.js-thumbnails li');

  var activeImage;
  var activeClass = 'is-active';

  // Thumbnails functionality
  $(images).each(function(index, image){
    $(image).on('click', function () {
      if ( activeImage !== image) {
        splide.go( index );
      }
    });
  });

  splide.on( 'mounted move', function ( newIndex ) {
    // Deactivate dragging when there's a single slide
    if ( splide.length === 1 ) {
      splide.options.drag = false;
    }

    // newIndex will be undefined through the "mounted" event.
    var image = images[ newIndex !== undefined ? newIndex : splide.index ];

    if ( image && activeImage !== image ) {
      if ( activeImage ) {
        activeImage.classList.remove( activeClass );
      }

      image.classList.add( activeClass );
      activeImage = image;
    }
  } );

  splide.on( 'arrows:updated', function( prev, next ) {
    // Hide navigation arrow when there's a single slide
    if ( splide.length === 1 ) {
      prev.hidden = true;
      next.hidden = true;
    }
  } );

  splide.mount();
}
