$(document).on('turbolinks:load', function(e) {
  var currentLocaleDomNode = $('#current_locale');
  if (currentLocaleDomNode.length > 0) {
    var locale = currentLocaleDomNode.data('i18n').locale;
    $('.datepicker').datepicker({
      language: locale,
      autoclose: true
    });
  }
});