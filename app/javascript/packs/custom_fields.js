$(document).on('turbolinks:load', function(e) {

  $(document).on('click', 'form .remove_fields', function(event) {
    $(this).prev('input[type=hidden]').val('1');
    $(this).closest('.form-row').addClass('d-none');
    event.preventDefault();
  });

  $(document).on('click', 'form .add_fields', function(event) {
    const time = new Date().getTime();
    const regexp = new RegExp($(this).data('id'), 'g');
    $(this).before($(this).data('fields').replace(regexp, time));
    event.preventDefault();
  });

  // Make sure that parsley validation is disabled when we remove a particalar custom field from the UI
  $('form').parsley().on('form:validate', function (formInstance) {
    $('.cfield-validatable').each((function(index, element) {
      if ($(element).parent().closest('div.form-row').hasClass('d-none') || !$(element).closest('div').hasClass('d-block')){
        $(element).removeAttr('data-parsley-required');
        $(element).removeAttr('data-parsley-required-message');
      }
    }));
  });

  // On mounting, detect any dropdown field and render its sibling options text field accordingly
  $('.field-type-select').each((function(index, element) {
    $(element).val() === 'dropdown' ? $(element).closest('div.form-row').children('.d-none').toggleClass('d-block', this.value === 'dropdown') : '';
  }));

  // When changing a custom field type, listen to select changes so that the options text field is rendered when appropriate.
  $('form').on('change', '.field-type-select', function(selection) {
    $(this).closest('div.form-row').children('.d-none').toggleClass('d-block', this.value === 'dropdown');
  });

});