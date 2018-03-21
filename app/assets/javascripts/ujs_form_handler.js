$(document).on('turbolinks:load', function(e) {
  $('#new_property').on("ajax:before", function(event, xhr, opts) {
    if ($('#preventformsubmit').length > 0) {
      if (Object.keys(window.uppy_uploader.getState().files).length){
        event.preventDefault();
        return false;
      } else{
        // console.log('OK. This is the event');
        // console.log(event);
        // console.log(xhr);
        // console.log(opts);
        // window.sevent = event;
        // window.xhr = xhr;
        // window.options = opts;

        // Remove element from DOM before ujs serializes the form
        $(event.target).find('#property_images').remove();
      }
    }
  });
});

