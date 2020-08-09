/* This is basically a customized version of active_uploads_controller.js of activestorage. */
import { DirectUploadController } from "@rails/activestorage/src/direct_upload_controller";
import { dispatchEvent } from '@rails/activestorage/src/helpers';

// Changed line
const uppySelector = "input[type=file][data-direct-upload-url].uppy-emitters:not([disabled])";
// Changed line
const fileSelector = "input[type=file][data-direct-upload-url].file-emitters:not([disabled])";

export class CustomDirectUploadsController {
  constructor(form) {
    this.form = form;
    // Changed line
    this.$mockUppyEmitters = $(uppySelector);
    this.$mockFileEmitters = $(fileSelector);

    // Changed line
    this.$inputs = $(uppySelector + "," + fileSelector);

    // DEBUG
    // console.log(`this.$inputs are:`);
    // console.log(this.$inputs);

    // Changed line
    // Get file inputs with available files:
    const activeFileInputs = $(fileSelector).filter((inputNo, input) => {return input.files.length});

    // DEBUG
    // console.log(`activeFileInputs are:`);
    // console.log(activeFileInputs);

    // Changed line
    // Get files from uppy:
    const uppy_files = $.map(window.uppy_uploader.state.files, (input) => {
      input.data.source = 'uppy';
      input.data['id'] = input.id;
      // .data is where the actual File object resides in
      return input.data
    });

    // Changed line
    // Get regular files from file inputs:
    const regular_files = $.map(activeFileInputs, (fileInput) => {
      return $.each($(fileInput.files).toArray(), (index, file) => {
        file.source = 'formfile';
      });
    });

    // DEBUG
    // console.log(`uppy_files are: `);
    // console.log(uppy_files);
    // console.log(`regular_files are: ${regular_files}`);
    // console.log(regular_files);

    // Changed line
    this.all_files = $.merge(uppy_files, regular_files) || [];

    // DEBUG
    // console.log(`all_files are:`);
    // console.log(this.all_files);
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
        // document.getElementById('preventformsubmit').remove();
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
    $.each(this.all_files, (uppyfilename, file) => {
      // DEBUG
      // console.log(uppyfilename);
      // console.log(file);

      // Changed line
      // Single mock element guaranteed to be on the DOM.
      let mockEmitter = file.source === 'uppy'
        ? this.$mockUppyEmitters.get(0)
        : this.$mockFileEmitters.get(0);

      const controller = new DirectUploadController(mockEmitter, file);
      // const controller = new DirectUploadController(mockEmitter, filewrapper.data);
      controllers.push(controller);
    });
    return controllers;
  }

  dispatch(name, detail = {}) {
    return dispatchEvent(this.form, `direct-uploads:${name}`, { detail });
  }
}
