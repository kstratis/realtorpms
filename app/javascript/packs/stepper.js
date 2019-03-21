import FormStepper from '../bundles/steppers/form_stepper';

$(document).on('turbolinks:load', function(e) {
  window.ParsleyConfig = {
    errorsWrapper: '<li class="alert-box-item"></li>',
    errorTemplate: '<span></span>',
    excluded:
    // Defaults
      'input[type=button],' +
      'input[type=submit],' +
      'input[type=reset],'  +
      'input[type=hidden],' +
      '[disabled],'         +
      ':hidden,'            +
      // -- Additional attributes to look --
      '[data-parsley-disabled],' +  // Exclude specific input/select/radio/checkbox/etc
      '[data-parsley-disabled] *'   // Exclude all nesting inputs/selects/radios/checkboxes/etc
  };

  const $stepperForm = $('#new_property, [id^=edit_property_]');
  if ($stepperForm.length < 1) return;

  // make sure you never send over the owner's id
  $("input[name='property[owner_attributes][id]']").prop('disabled', true);

  window.form_stepper = new FormStepper($stepperForm);

  // --------------------------------
  // Sets up the checkbox-dependant input fields in step 3 (amenities)
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

  // This handles the nested property owner form to either select from an existing list or create a new
  $('.client-radio-selection').on('click', (e) => {
    let selectedOption = $(e.target).attr('id');
    let counterElements = $(`#${selectedOption}`).data().counteroption.split(',');
    $(counterElements).each((index, counterElement) => $(`.${counterElement}`).addClass('disabledElement'));
    $(counterElements).each((index, counterElement) => $(`.${counterElement}`).find(`input.${counterElement}_input`).attr('disabled', true));
    $(`.${selectedOption}`).removeClass('disabledElement');
    $(`.${selectedOption}`).find(`input.${selectedOption}_input`).removeClass('disabledElement');
    $(`.${selectedOption}`).find(`input.${selectedOption}_input`).attr('disabled', false);
  });

  // We need the focus event to reset state in the animated/themed form input fields
  // ...and we also need to direct the user to the first input field
  $('.client-radio-selection.edit').one('click', (e) => {
    $('.new_client_input').val('');
    $('.new_client_input').focus();
    $('.new_client_input').first().focus();
  });
});


function leavePage(msg) {
  if (confirm(msg)) {
    window.form_stepper.destroy();
    return true;
  } else {
    return false;
  }
}
// This basically listens for window unload
$(document).on("page:before-change turbolinks:before-visit", function() {
  // Make sure it only works on the properties stepper
  if (window.location.pathname === '/properties/new') {
    // Gets the stepper status. If untouched then don't bug the user. Otherwise, show a warning
    if (!window.form_stepper.getStatus()) return;
    var alertsDomNode = $('#alerts');
    var alertsTranslations = alertsDomNode.data('i18n').alerts;
    return leavePage(alertsTranslations['leave_page']);
    // return confirm(alertsTranslations['leave_page']);
  }
});


