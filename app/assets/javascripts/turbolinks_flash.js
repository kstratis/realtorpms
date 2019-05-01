// $('document').ready(function() {
//   setTimeout(function() {
//     $('.alert').slideUp();
//   }, 3000);
// });
$('document').ready(function() {
  $('button.close').on('click', function(){
    $('.alert').alert('close');
    // $(this).slideUp();
  })
});