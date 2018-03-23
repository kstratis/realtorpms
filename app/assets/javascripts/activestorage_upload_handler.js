$(document).on('turbolinks:load', function(e) {
  var randomdate = Date.now();
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
    // const {id, error} = event.detail;
    const element = document.getElementById("direct-upload-" + id);
    element.classList.add("direct-upload--error");
    element.setAttribute("title", error)
  });

  addEventListener("direct-upload:end", function(event) {
    var file = event.detail.file;
    window.uppy_uploader.emit('upload-success', window.uppy_uploader.getState().files[file.id], { message: 'Completed Successfully'});
    // const element = document.getElementById(`direct-upload-${id}`);
    // element.classList.add("direct-upload--complete");
  });
});