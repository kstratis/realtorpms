$(document).on('turbolinks:load', function(e) {
  if (window.location.pathname === '/properties/new' || window.location.pathname.match(/^\/properties\/\d+\/edit$/)) {
    // DEBUG
    // console.log('Validation plugin loaded');
    var jqvalidatorDomNode = $('#jqvalidator');
    var jqtranslations = jqvalidatorDomNode.data('i18n').jqvalidator;
    $.extend($.validator.messages, jqtranslations);
    $('#new_property, [id^=edit_property_]').validate({
      rules: {
        'property[businesstype]': {
          required: true
        },
        'property[category]': {
          required: true
        },
        'property[subcategory]': {
          required: true
        },
        'property[locationid]': {
          required: true
        },
        'property[price]': {
          digits: true
        },
        'property[size]': {
          digits: true
        },
        'property[bedrooms]': {
          digits: true
        },
        'property[bathrooms]': {
          digits: true
        }
      }
    });
  }
});
