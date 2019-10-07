$(document).on('turbolinks:load', function(e) {


  // const $modal = $('#customFieldModal');
  // if ($modal.length < 1) return;
  // console.log('modal exists continuing');
  // $modal.appendTo('body');
  // $modal.appendTo("body").modal('show');


  // $printable.on('click', function (event) {
  //   event.preventDefault();
  //   popupWindow($(this).data('url'), null, "900", "600");
  // });
  // $(document).on('click', 'form .remove_fields', function(event) {
  $('form .remove_fields').on('click', function(event) {
    console.log('remove running');
    $(this).prev('input[type=hidden]').val('1');
    $(this).closest('.form-row').hide();
    event.preventDefault();
  });

  // $(document).on('click', 'form .add_fields', function(event) {
  $('form .add_fields').on('click', function(event) {

    console.log('add running');
    const time = new Date().getTime();
    const regexp = new RegExp($(this).data('id'), 'g');
    // $(this).before($(this).data('fields').replace(regexp, time));
    $(this).before($(this).data('fields').replace(regexp, time));
    event.preventDefault();

  });

});