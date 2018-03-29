$(document).on('turbolinks:load', function(e) {

  // This shouldn't be hardcoded
  if (window.location.pathname === '/properties/new' ) {
    var jqvalidatorDomNode = $('#jqvalidator');
    var jqtranslations = jqvalidatorDomNode.data('i18n').jqvalidator;
    $.extend($.validator.messages, jqtranslations);

    $('#new_property').validate({
      rules: {
        'property[description]': {
          required: true,
          maxlength: 250
        },
        'property[category]': {
          required: true
        },
        'property[subcategory]': {
          required: true
        },
        'property[price]': {
          digits: true
        },
        'property[size]': {
          digits: true
        }
      }
    });
  }

  $('#new_property').on("ajax:before", function(event, xhr, opts) {
    if ($('#preventformsubmit').length > 0) {
      if (Object.keys(window.uppy_uploader.getState().files).length){

        event.preventDefault();
        return false;
      } else{
        // console.log('OK. This is the event');
        // console.log(event);
        // console.log(xhr);
        // console.log(opts);
        // window.sevent = event;
        // window.xhr = xhr;
        // window.options = opts;

        // Remove element from DOM before ujs serializes the form
        $(event.target).find('#property_images').remove();
      }
    }
  });
});

