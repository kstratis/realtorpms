import FormStepper from '../bundles/steppers/form_stepper';

$(document).on('turbolinks:load', function(e) {
  window.form_stepper = new FormStepper();
});
