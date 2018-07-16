$(document).on('turbolinks:load', function(e) {
  // This handles client side form validations for property create
  // This shouldn't be hardcoded
  if (window.location.pathname === '/properties/new') {
    var jqvalidatorDomNode = $('#jqvalidator');
    var jqtranslations = jqvalidatorDomNode.data('i18n').jqvalidator;
    $.extend($.validator.messages, jqtranslations);
    $('#new_property').validate({
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