$(document).on('turbolinks:load', function(e) {
  var randomdate = Date.now();
  var uploadErrorExists = false;
  addEventListener("direct-upload:initialize", function(event) {
    var file = event.detail.file;
    window.uppy_uploader.emit('upload-started', window.uppy_uploader.getState().files[file.id], {
      uploader: 'activestorage',
      bytesUploaded: 0,
      bytesTotal: file.size
    });
  });

  addEventListener("direct-upload:start", function(event) {
    var id = event.detail.id;
  });

  addEventListener("direct-upload:progress", function(event) {
    var file = event.detail.file;
    var bytesUploaded = event.detail.bytesUploaded;
    window.uppy_uploader.emit('upload-progress', window.uppy_uploader.getState().files[file.id], {
      uploader: 'activestorage',
      bytesUploaded: bytesUploaded,
      bytesTotal: file.size,
      uploadStarted: randomdate,
      uploadCompleted: false
    });
  });

  addEventListener("direct-upload:error", function(event) {
    event.preventDefault();
    var file = event.detail.file;
    var error = event.detail.error;
    // const {id, error} = event.detail;
    // uppy.on('upload-error', (file, error) => {
    //   console.log('error with file:', file.id)
    //   console.log('error message:', error)
    // })
    uploadErrorExists = true;
    window.uppy_uploader.emit('upload-error', window.uppy_uploader.getState().files[file.id], error);
    console.error(error);
    // window.uppy_uploader.reset();

    // const element = document.getElementById("direct-upload-" + id);
    // element.classList.add("direct-upload--error");
    // element.setAttribute("title", error)
  });

  addEventListener("direct-upload:end", function(event) {
    var file = event.detail.file;
    if (!uploadErrorExists) {
      window.uppy_uploader.emit('upload-success', window.uppy_uploader.getState().files[file.id], {message: 'Completed Successfully'});
    } else{
      errorExists = false;
      var swalDomNode = $('#swal');
      var swalTranslations = swalDomNode.data('i18n').swal;
      swal({
        type: 'error',
        title: swalTranslations.file_upload_fail_title,
        text: swalTranslations.file_upload_fail_body
      }).then(function(result){
        // The parameter set to 'true' reloads a fresh copy from the server.
        // Leaving it out will serve the page from cache.
        window.location.reload(true);
      });
    }
    // const element = document.getElementById(`direct-upload-${id}`);
    // element.classList.add("direct-upload--complete");
  });
});