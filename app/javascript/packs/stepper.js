import FormStepper from '../bundles/steppers/form_stepper';

$(document).on('turbolinks:load', function(e) {
  // $stepperForm = $('#new_property, [id^=edit_property_]').parsley();
  const $stepperForm = $('#new_property, [id^=edit_property_]');
  if ($stepperForm.length < 1) return;
  window.form_stepper = new FormStepper($stepperForm);
});
