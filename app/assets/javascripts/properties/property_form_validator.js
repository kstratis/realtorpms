$(document).on('turbolinks:load', function(e) {
  // This handles client side form validations for property create
  // This shouldn't be hardcoded
  // var editPathExists = window.location.pathname.match(/^\/properties\/\d+\/edit$/);
  // var objectID = editPathExists ? editPathExists[1] : 'na';
  if (window.location.pathname === '/properties/new' || window.location.pathname.match(/^\/properties\/\d+\/edit$/)) {
    console.log('running validation');
    var jqvalidatorDomNode = $('#jqvalidator');
    console.log(jqvalidatorDomNode);
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
