$(document).on('turbolinks:load', function(e) {
  if (window.location.pathname === '/properties/new') {
    // Handle the special selectbox fields with text value
    // console.log($('input[type=checkbox]').prop('checked'));
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
  }
});
