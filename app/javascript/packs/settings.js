$(document).on('turbolinks:load', function(e) {

    // Activate only if tabs are are available
    const tabs = $('.nav-tabs');
    if (tabs.length < 1) return;

    // Restore active tab from url anchor (if available)
    var hash = window.location.hash;
    hash && $('.nav a[href="' + hash + '"]').tab('show');

    // Activate tab on click
    $('.nav-tabs a').click(function(e) {
      // $(this).tab('show');

      var scrollmem = $('body').scrollTop();
      window.location.hash = this.hash;
      $('html,body').scrollTop(scrollmem);
    });

});