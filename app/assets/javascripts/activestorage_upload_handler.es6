$(document).on('turbolinks:load', function(e) {
  var randomdate = Date.now();
  addEventListener("direct-upload:initialize", event => {
    const {target, detail} = event;
    const {id, file} = detail;
    window.uppy_uploader.emit('upload-started', window.uppy_uploader.getState().files[file.id], {
      uploader: 'activestorage',
      bytesUploaded: 0,
      bytesTotal: file.size
    });
  });

  addEventListener("direct-upload:start", event => {
    const {id} = event.detail;
  });

  addEventListener("direct-upload:progress", event => {
    const {id, file, progress, bytesUploaded} = event.detail;
    window.uppy_uploader.emit('upload-progress', window.uppy_uploader.getState().files[file.id], {
      uploader: 'activestorage',
      bytesUploaded: bytesUploaded,
      bytesTotal: file.size,
      uploadStarted: randomdate,
      uploadCompleted: false
    });
  });

  addEventListener("direct-upload:error", event => {
    event.preventDefault();
    const {id, error} = event.detail;
    const element = document.getElementById(`direct-upload-${id}`);
    element.classList.add("direct-upload--error");
    element.setAttribute("title", error)
  });

  addEventListener("direct-upload:end", event => {
    const {id, file} = event.detail;
    window.uppy_uploader.emit('upload-success', window.uppy_uploader.getState().files[file.id], { message: 'complete'});
    // const element = document.getElementById(`direct-upload-${id}`);
    // element.classList.add("direct-upload--complete");
  });
});