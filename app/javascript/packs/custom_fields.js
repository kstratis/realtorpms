$(document).on('turbolinks:load', function(e) {

  const $modal = $('#customFieldModal');
  if ($modal.length < 1) return;
  console.log('modal exists continuing');
  $modal.appendTo('body');
  // $modal.appendTo("body").modal('show');


  // $printable.on('click', function (event) {
  //   event.preventDefault();
  //   popupWindow($(this).data('url'), null, "900", "600");
  // });
  $(document).on('click', 'form .remove_fields', function(event) {
    $(this).prev('input[type=hidden]').val('1');
    $(this).closest('fieldset').hide();
    event.preventDefault();
  });

  $(document).on('click', 'form .add_fields', function(event) {
    event.preventDefault();
    let time = new Date().getTime();

    // console.log($(this).data('id'));
    let regexp = new RegExp($(this).data('id'), 'g');
    // console.log(regexp);
    // console.log($(this).data('fields'));
    const interim  = $(this).data('fields').replace(regexp, time);
    console.log(interim);
    $(this).before(interim);
  });

});