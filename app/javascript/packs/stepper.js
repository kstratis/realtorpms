import FormStepper from '../bundles/steppers/form_stepper';

// The Stepper currently only applies to property add
$(document).on('turbolinks:load', function(e) {
  const $stepperForm = $('#new_property, [id^=edit_property_]');
  if ($stepperForm.length < 1) return;

  window.form_stepper = new FormStepper($stepperForm);

  // --------------------------------
  // Sets up dependent checks
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
  // --------------------------------

  // --------------------------------
  /** Handles the property form validators (new, edit)
   *  When a form is submitted the following happen before a proper ajax request is sent to the server:
   * 1. JQuery validate intercepts the request and runs its validations
   * 2. If validations pass, active storage takes care of uploading media files
   * 3. A custom ajax:before handler is fired which checks if the (available) files are uploaded and POSTs the form
   * */
  $stepperForm.on('ajax:before', function(event, xhr, opts) {
    if ($('#preventformsubmit').length > 0) {
      if (Object.keys(window.uppy_uploader.getState().files).length) {
        // DEBUG
        // console.log('files are: ' + Object.keys(window.uppy_uploader.getState().files).length);
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
  // --------------------------------
});

$(document).on("page:before-change turbolinks:before-visit", function() {
  if (window.location.pathname === '/properties/new' || window.location.pathname.match(/^\/properties\/\d+\/edit$/)) {
    return confirm("Your changes may not be saved yet. Are you sure you want to leave the page?");
  }
});
