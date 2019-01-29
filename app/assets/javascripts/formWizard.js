$(document).on('turbolinks:load', function(e) {
  $('#smartwizard').smartWizard({
    theme: 'arrows',
    transitionEffect: 'fade',
    useURLhash: false,
    showStepURLhash: false
  });
});

