// Browser upload file reader
$(document).on('turbolinks:load', function(e) {
  const $avatar_upload = $('#avatar_upload');
  if ($avatar_upload.length < 1) return;
  function readURL(input) {
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      reader.onload = function(e) {
        // $('#avatar_preview').attr('src', e.target.result);
        $('#avatar_preview').is('img')
          ? $('#avatar_preview').attr('src', e.target.result)
          : $('#avatar_preview').replaceWith(
              `<img class="alphatar-edit" id="avatar_preview" src="${e.target.result}">`
            );
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  $avatar_upload.change(function() {
    readURL(this);
  });
});
