export default class ASUploadHandler {

  constructor() {
    this.start();
  }

  start() {
    let uploadErrorExists = false;
    addEventListener("direct-upload:initialize", function(event) {
      const file = event.detail.file;
      if (file.source === "formfile") {
        $("#property-avatar-spinner").fadeIn();
        return;
      }
      window.uppy_uploader.emit("upload-started", window.uppy_uploader.getState().files[file.id], {
        uploader: "activestorage",
        bytesUploaded: 0,
        bytesTotal: file.size
      });
    });

    addEventListener("direct-upload:progress", function(event) {
      const file = event.detail.file;
      if (file.source === "formfile") return;
      const progress = Math.floor(event.detail.progress) || 0;
      window.uppy_uploader.emit("upload-progress", window.uppy_uploader.getState().files[file.id], {
        uploader: "activestorage",
        bytesUploaded: Math.floor((file.size * progress) / 100) || 0,
        bytesTotal: file.size,
        uploadStarted: Date.now(),
        uploadComplete: false,
      });
    });

    addEventListener("direct-upload:error", function(event) {
      event.preventDefault();
      const file = event.detail.file;
      const error = event.detail.error;
      if (file.source === "formfile") {
        $("#property-avatar-spinner").fadeOut();
        return;
      }
      uploadErrorExists = true;
      window.uppy_uploader.emit("upload-error", window.uppy_uploader.getState().files[file.id], error);
      // Eventually we may have to handle this
      console.error(error);
    });

    addEventListener("direct-upload:end", function(event) {
      const file = event.detail.file;
      // Assuming it's an avatar
      if (file.source === "formfile") {
        $("#property-avatar-spinner").fadeOut();
        return;
      }
      if (!uploadErrorExists) {
        window.uppy_uploader.emit("upload-success", window.uppy_uploader.getState().files[file.id], {
          message: "Completed Successfully"
        });
      } else {
         Turbolinks.visit(window.location.href);
      }
    });
  }
}