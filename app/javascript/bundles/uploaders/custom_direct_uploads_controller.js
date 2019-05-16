/* This is basically a customized version of active_uploads_controller.js of activestorage. */
import { DirectUploadController } from "activestorage/src/direct_upload_controller";
import { dispatchEvent } from 'activestorage/src/helpers';

// changed line
const inputSelector = "input[type=file][data-direct-upload-url].uppy-emitters,.standard-emitters:not([disabled])";

export class CustomDirectUploadsController {
  constructor(form) {
    this.form = form;
    // changed line
    this.$mockEmitters = $(inputSelector);

    this.$inputs = $(this.form).find(this.$mockEmitters).filter(input => input.files.length);
    // changed line
    this.files = window.uppy_uploader.state.files || []; // This is how we get the files-to-be-uploaded using uppy.js
  }

  start(callback) {
    const controllers = this.createUploadControllers();

    const startNextController = () => {
      const controller = controllers.shift();
      if (controller) {
        controller.start(error => {
          if (error) {
            callback(error);
            this.dispatch('end');
          } else {
            startNextController();
          }
        });
      } else {
        // added line [added]
        document.getElementById('preventformsubmit').remove();
        callback();
        this.dispatch('end');
      }
    };

    this.dispatch('start');
    startNextController();
  }

  createUploadControllers() {
    const controllers = [];
    // changed line
    const mockEmitter = this.$mockEmitters.get(0); // Single mock element guaranteed to be on the DOM.
    // changed block
    $.each(this.files, (uppyfilename, filewrapper) => {
      filewrapper.data['id'] = filewrapper.id;
      const controller = new DirectUploadController(mockEmitter, filewrapper.data);
      controllers.push(controller);
    });
    return controllers;
  }

  dispatch(name, detail = {}) {
    return dispatchEvent(this.form, `direct-uploads:${name}`, { detail });
  }
}
