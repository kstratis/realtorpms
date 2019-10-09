$(document).on('turbolinks:load', function(e) {

  $(document).on('click', 'form .remove_fields', function(event) {
    $(this).prev('input[type=hidden]').val('1');
    $(this).closest('.form-row').hide();
    event.preventDefault();
  });

  $(document).on('click', 'form .add_fields', function(event) {
    const time = new Date().getTime();
    const regexp = new RegExp($(this).data('id'), 'g');
    $(this).before($(this).data('fields').replace(regexp, time));
    event.preventDefault();
  });

  // On mount
  $('.field-type-select').each((function(index, element) {
    $(element).val() === 'dropdown' ? $(element).closest('div.form-row').children('.d-none').toggleClass('d-block', this.value === 'dropdown') : '';
  }));

  // On dynamic add/remove
  $('form').on('change', '.field-type-select', function(selection) {
    $(this).closest('div.form-row').children('.d-none').toggleClass('d-block', this.value === 'dropdown');
  });


});