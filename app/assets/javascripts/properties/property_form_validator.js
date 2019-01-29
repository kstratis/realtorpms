$(document).on('turbolinks:load', function(e) {
  if (window.location.pathname === '/properties/new' || window.location.pathname.match(/^\/properties\/\d+\/edit$/)) {

    // Handle the property form dependant fields
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

    // Handle the property form validators (new, edit)
    // -------------------------------------
    var jqvalidatorDomNode = $('#jqvalidator');
    var jqtranslations = jqvalidatorDomNode.data('i18n').jqvalidator;
    $.extend($.validator.messages, jqtranslations);
    console.log('validation runs');
    var $v = $('#new_property, [id^=edit_property_]').validate({
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


    // Handle the property form wizard
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
      // var elmForm = $('#form-step-' + stepNumber);
      // stepDirection === 'forward' :- this condition allows to do the form validation
      // only on forward navigation, that makes easy navigation on backwards still do the validation when going next
      // if (stepDirection === 'forward' && elmForm) {
      //   elmForm.validator('validate');
      //   var elmErr = elmForm.children('.has-error');
      //   if (elmErr && elmErr.length > 0) {
      //     // Form validation failed
      //     return false;
      //   }
      // }
      // return true;
    });
    // -------------------------------------

  }
});
