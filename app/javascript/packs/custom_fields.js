import { clearValidatableFields } from './utilities';

$(document).on('turbolinks:load', function(e) {

  const form = $('form.validatable');
  if (form.length < 1) return;

  $(document).on('click', 'form .remove_fields', function(event) {
    $(this).prev('input[type=hidden]').val('1');
    $(this).closest('.form-row').addClass('d-none');
    event.preventDefault();
  });

  $(document).on('click', 'form .add_fields', function(event) {
    event.preventDefault();
    const time = new Date().getTime();
    const regexp = new RegExp($(this).data('id'), 'g');
    $(this).before($(this).data('fields').replace(regexp, time));

  });

  // Make sure that parsley validation is disabled when we remove any particular custom field from the UI
  form.parsley().on('form:validate', function (formInstance) {
    clearValidatableFields('.cfield-validatable');
  });

  // On mounting, detect any dropdown field and render its sibling options text field accordingly
  $('.field-type-select').each((function(index, element) {
    $(element).val() === 'dropdown' ? $(element).closest('div.form-row').children('.d-none').toggleClass('d-block', this.value === 'dropdown') : '';
  }));

  // When changing a custom field type, listen to select changes so that the options text field is rendered when appropriate.
  form.on('change', '.field-type-select', function(selection) {
    $(this).closest('div.form-row').children('.d-none').toggleClass('d-block', this.value === 'dropdown');
  });

});

// Unbind handlers
$(document).on("page:before-change turbolinks:before-visit", function() {
  const cfields_form = $('form.validatable');
  if (cfields_form.length < 1) return;
  $(document).off('click', 'form .add_fields');
  $(document).off('click', 'form .remove_fields');
  cfields_form.parsley().off('form:validate');
  cfields_form.off('change', '.field-type-select');
});