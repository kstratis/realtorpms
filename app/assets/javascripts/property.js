// After an ajax action a given button may either rewind history by 1
// or return to a generic screen of our selection
jQuery.fn.returnOnClick = function(location) {
  $(this).on('click', function(e) {
    e.preventDefault();
    history.length === 2 ? Turbolinks.visit(location, { action: 'advance' }) : history.go(-1)
  });
  return this;
};