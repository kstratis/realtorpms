import { DirectUploadController } from "./direct_upload_controller";
// This following line was changed
import { findElements, dispatchEvent } from "./helpers"

// This following line was changed
const inputSelector = "input[type=hidden].emitters:not([disabled]";

export class DirectUploadsController {
  constructor(form) {
    this.form = form;
    // The following line was changed
    this.inputs = findElements(form, inputSelector);
    console.log('direct running');
    console.log(this.inputs);
  }

  start(callback) {
    const controllers = this.createDirectUploadControllers();
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
        })
      } else {
        // The following line was added
        document.getElementById('preventformsubmit').remove();
        console.log('removed the line');
        callback();
        this.dispatch('end');
      }
    };

    this.dispatch('start');
    startNextController();
  }

  // The following method was changed
  createDirectUploadControllers() {
    const controllers = [];
    const mockEmitter = this.inputs[0];
    $.each(window.uppy_uploader.state.files, (uppyfilename, filewrapper) => {
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
