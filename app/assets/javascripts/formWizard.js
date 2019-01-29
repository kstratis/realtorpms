// $(document).on('turbolinks:load', function(e) {
//   $('#smartwizard').smartWizard({
//     theme: 'arrows',
//     transitionEffect: 'fade',
//     useURLhash: false,
//     showStepURLhash: false,
//     anchorSettings: {
//       anchorClickable: true,
//       enableAllAnchors: true
//     }
//   });
//
//   $('#smartwizard').on('leaveStep', function(e, anchorObject, stepNumber, stepDirection) {
//     console.log('leaving');
//     $('#new_property').validate();
//     // var elmForm = $('#form-step-' + stepNumber);
//     // stepDirection === 'forward' :- this condition allows to do the form validation
//     // only on forward navigation, that makes easy navigation on backwards still do the validation when going next
//     // if (stepDirection === 'forward' && elmForm) {
//     //   elmForm.validator('validate');
//     //   var elmErr = elmForm.children('.has-error');
//     //   if (elmErr && elmErr.length > 0) {
//     //     // Form validation failed
//     //     return false;
//     //   }
//     // }
//     // return true;
//   });
// });
//
