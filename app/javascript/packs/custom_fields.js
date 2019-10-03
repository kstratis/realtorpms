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
});