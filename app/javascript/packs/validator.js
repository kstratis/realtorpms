$(document).on('turbolinks:load', function(e) {
  const $form = $('.js-validatable');
  if ($form.length < 1) return;
  $form.parsley();
  $form.on('form:submit', function(formInstance) {
    formInstance.validate();
  });
});
