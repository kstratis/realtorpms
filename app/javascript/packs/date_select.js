$(document).on('turbolinks:load', function(e) {
  const $selects = $('select.custom-select.date-select');
  if ($selects.length < 1) return;
  $selects.wrap('<div class="col-4">');
});