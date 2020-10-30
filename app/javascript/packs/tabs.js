$(document).on('turbolinks:load', function (e) {
  // Activate only if tabs are available
  const tabs = $('.nav-tabs.anchor-support');
  if (tabs.length < 1) return;

  var hash = window.location.hash;
  hash && $('.nav a[href="' + hash + '"]').tab('show');

  // Activate tab on click
  $('.nav-tabs a').click(function (e) {
    var scrollmem = $('body').scrollTop();
    // Back button with hashes in URL has a few known problems in Turbolinks.
    // https://github.com/turbolinks/turbolinks/issues/219
    history.pushState(history.state, '', this.hash);
    $('html,body').scrollTop(scrollmem);
  });
});
