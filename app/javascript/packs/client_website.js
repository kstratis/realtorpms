import { Application } from 'stimulus';
import { definitionsFromContext } from 'stimulus/webpack-helpers';

require("@rails/ujs").start();
import './turbolinks_wrapper';
require("@fancyapps/fancybox");

// STIMULUS BOOTSTRAPPING
const application = Application.start();
const context = require.context('../controllers', true, /\.js$/);
application.load(definitionsFromContext(context));
// END OF STIMULUS BOOTSTRAPPING

// Fancybox functionality
$(document).on('turbolinks:load', function(e) {
  // Initialize carousel elements via `Splide`
  // `Splide` is loaded directly via jsdelivr in skeleton.html.erb
  initCarousels();

  $('[data-fancybox^="regular-info"]').fancybox({
    afterLoad: function( instance ) {
      if (instance.$refs.inner.find('div.info').length){
        instance.$refs.stage.css('width', '100%');
        instance.$refs.stage.css('background', 'unset');
        instance.update();
      }
    }
  });

  $('[data-fancybox^="about-info"]').fancybox({
    afterLoad: function( instance ) {
      if (instance.$refs.inner.find('div.info').length){
        instance.$refs.stage.css('width', '100%');
        instance.$refs.stage.css('background', 'unset');
        instance.update();
      }
    }
  });

  $('[data-fancybox^="pictures"]').fancybox({
    animationEffect   : "fade",
    animationDuration : 300,
    margin : 0,
    gutter : 0,
    touch  : {
      vertical: false
    },
    baseTpl	:
      `<div class="fancybox-container fancybox-show-nav" role="dialog" tabindex="-1">
        <div class="fancybox-bg"></div>
        <div class="fancybox-inner">
          <div class="fancybox-stage">
            <div class="fancybox-navigation">
              <button data-fancybox-prev="" class="fancybox-button fancybox-button--arrow_left" title="Previous" disabled="">
                <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"></path></svg></div>
              </button>
              <button data-fancybox-next="" class="fancybox-button fancybox-button--arrow_right" title="Next">
                <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"></path></svg></div>
              </button>
            </div>
          </div>
          <div class="fancybox-form-wrap">
            <button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">
              <svg viewBox="0 0 40 40"><path d="M10,10 L30,30 M30,10 L10,30" /></svg>
            </button>
          </div>
        </div>
      </div>`,
    onInit: function(instance) {
      // #1 Add property form
      // ===================
      //`instance` is the fancybox instance after
      // clicking on an item. Its `.group` attribute is the group of the
      // containing tags of this item which have the same `data-fancybox`
      // attribute value.

      // Find current form element. instance.currIndex is always 0 on startup.
      // Effectively this grabs the first data-fancybox tag of the group and
      // navigates the DOM from there.
      const current = instance.group[instance.currIndex];
      instance.$refs.form = current.opts.$orig.closest('.property').find('.property-form');
      // ...and move it to the container
      instance.$refs.form.appendTo( instance.$refs.container.find('.fancybox-form-wrap') );

      // #2 Create bullet navigation links
      // =================================
      let list = '', $bullets;

      for ( let i = 0; i < instance.group.length; i++ ) {
        list += `<li><a data-index="${i}" href="javascript:;"><span>${i + 1}</span></a></li>`;
      }

      $bullets = $(`<ul class="property-bullets">${list}</ul>`).on('click touchstart', 'a', function() {
        const index = $(this).data('index');

        $.fancybox.getInstance(function() {
          this.jumpTo( index );
        });
      });

      instance.$refs.bullets = $bullets.appendTo( instance.$refs.stage );
    },

    beforeShow: function( instance ) {

      // Mark current bullet navigation link as active
      instance.$refs.stage.find('ul:first')
        .children()
        .removeClass('active')
        .eq( instance.currIndex )
        .addClass('active');

    },

    // This adds proper padding to the svg placeholder
    afterLoad: function (instance){
      const img = $('.fancybox-image');
      const fileExtension = img.attr('src').split('.').slice(-1)[0]
      if ((fileExtension === 'svg') && (img.length === 1)){
        img.addClass("house-placeholder-image-slider-avatar");
      }
    },

    afterClose: function(instance, current) {
      // Move form back to the place
      instance.$refs.form.appendTo( current.opts.$orig.parent() );
    }
  });
})

function initCarousels() {
  const slideElements = $('.splide').not('#splide-gallery');
  slideElements.each((_, slideElement) => {
    new window.Splide(slideElement, { type: 'loop', lazyLoad: 'nearby'}).mount();
  });

  if ($('#splide-gallery').length === 0) return;

  var splide = new window.Splide('#splide-gallery', { pagination: false });
  var images = document.querySelectorAll( '.js-thumbnails li' );

  var activeImage;
  var activeClass = 'is-active';

  for ( let i = 0, len = images.length; i < len; i++ ) {
    const image = images[ i ];

    splide.on( 'click', function () {
      if ( activeImage !== image ) {
        splide.go( i );
      }
    }, image );
  }

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
