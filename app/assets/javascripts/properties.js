$(document).on('turbolinks:load', function(e) {
  if (window.location.pathname === '/properties/new' || window.location.pathname.match(/^\/properties\/\d+\/edit$/)) {
    // Stores away a reference to either a new property form or an edit form
    var $propertyform = $('#new_property, [id^=edit_property_]');

    /* Handles the initial state of the form's dependant fields */
    // -------------------------------------
    var elements = $('.dependent_check');
    var status;
    elements.each(function() {
      status = $(this).prop('checked');
      $(this)
        .siblings()
        .find('input.dependent_input')
        .prop('disabled', !status);
    });
    elements.change(function() {
      $(this)
        .siblings()
        .find('input.dependent_input')
        .prop('disabled', !this.checked);
    });
    // -------------------------------------

    /* Handles the property form validators (new, edit)
    *  When a form is submitted the following happen before a proper ajax request is sent to the server:
    * 1. JQuery validate intercepts the request and runs its validations
    * 2. If validations pass, active storage takes care of uploading media files
    * 3. A custom ajax:before handler is fired which checks if the (available) files are uploaded and POSTs the form
    * */
    // -------------------------------------
    var jqvalidatorDomNode = $('#jqvalidator');  // Gets the DOM containing the translations
    var jqtranslations = jqvalidatorDomNode.data('i18n').jqvalidator;
    $.extend($.validator.messages, jqtranslations);
    // The validate method will -by default- hijack the submit form in order to run its validations first.
    // However once validate() returns a validator reference which can be used to validate on demand.
    var $v = $propertyform.validate({
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
    // -------------------------------------

    /* This handler makes sure all files are uploaded before actually submitting the form */
    $propertyform.on('ajax:before', function(event, xhr, opts) {
      if ($('#preventformsubmit').length > 0) {
        if (Object.keys(window.uppy_uploader.getState().files).length) {
          event.preventDefault();
          return false;
        } else {
          // Remove element from DOM before ujs serializes the form
          $(event.target)
            .find('#property_images')
            .remove();
        }
      }
    });


    /* Handles the property form wizard */
    // -------------------------------------
    var $smartwizard = $('#smartwizard');

    $smartwizard.smartWizard({
      theme: 'arrows',
      transitionEffect: 'fade',
      useURLhash: false,
      showStepURLhash: false,
      anchorSettings: {
        anchorClickable: true,
        enableAllAnchors: true
      }
    });

    $smartwizard.on('leaveStep', function(e, anchorObject, stepNumber, stepDirection) {
      console.log('leaving');
      if (!$v.form()){
        return false;
      }
    });
    // -------------------------------------





  }
});
