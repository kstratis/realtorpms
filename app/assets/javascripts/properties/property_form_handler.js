$(document).on('turbolinks:load', function(e) {
  // This handles the new property form submission
  $('#new_property').on('ajax:before', function(event, xhr, opts) {
    if ($('#preventformsubmit').length > 0) {
      if (Object.keys(window.uppy_uploader.getState().files).length) {
        event.preventDefault();
        return false;
      } else {
        // Remove element from DOM before ujs serializes the form
        $(event.target)
          .find('#property_images')
          .remove();
      }
    }
  });
});
