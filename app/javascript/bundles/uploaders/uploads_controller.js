import { UploadController } from 'upload_controller';
import { dispatchEvent } from 'activestorage/src/helpers';

const inputSelector = 'input[type=hidden].emitters:not([disabled]';
const files = window.uppy_uploader.state.files; // This is how we get the files-to-be-uploaded using uppy.js

export class UploadsController {
  constructor(form) {
    this.form = form;
    this.$inputs = $(inputSelector);
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
        callback();
        this.dispatch('end');
      }
    };

    this.dispatch('start');
    startNextController();
  }

  createUploadControllers() {
    const controllers = [];
    const mockEmitter = this.$inputs.first(); // Single mock element guaranteed to be on the DOM.
    $.each(files, (uppyfilename, filewrapper) => {
      filewrapper.data['id'] = filewrapper.id;
      const controller = new UploadController(mockEmitter, filewrapper.data);
      controllers.push(controller);
    });
    return controllers;
  }

  dispatch(name, detail = {}) {
    return dispatchEvent(this.form, `direct-uploads:${name}`, { detail });
  }
}
