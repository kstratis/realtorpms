/* This is basically a customized version of active_uploads_controller.js of activestorage. */
import {DirectUploadController} from "@rails/activestorage/src/direct_upload_controller";
import {dispatchEvent, findElement, findElements, toArray} from '@rails/activestorage/src/helpers';

// Changed line
const uppySelector = "input[type=file][data-direct-upload-url].uppy-emitters:not([disabled])";
// Changed line
const fileSelector = "input[type=file][data-direct-upload-url].file-emitters:not([disabled])";

export class CustomDirectUploadsController {
  constructor(form) {
    this.form = form;
    // Changed line
    this.mockUppyEmitters = findElements(form, uppySelector);
    this.mockFileEmitters = findElements(form, fileSelector);

    // Changed line
    this.inputs = this.mockUppyEmitters.concat(this.mockFileEmitters)

    // DEBUG
    // console.log(`this.$inputs are:`);
    // console.log(this.$inputs);

    // Changed line
    // Get file inputs with available files:
    // const activeFileInputs = $(fileSelector).filter((inputNo, input) => {return input.files.length});
    const activeFileInputs = this.mockFileEmitters.filter((input) => {
      return input.files.length
    });

    // DEBUG
    // console.log(`activeFileInputs are:`);
    // console.log(activeFileInputs);

    // Changed line
    // Get files from uppy:
    const uppy_files = Object.values(window.uppy_uploader.state.files).map((input) => {
      input.data.source = 'uppy';
      input.data['id'] = input.id;
      // .data is where the actual File object resides in
      return input.data
    });

    // Changed line
    // Get regular files from file inputs:
    const nested_regular_files = Object.values(activeFileInputs).map((fileInput) => {
      return toArray(fileInput.files).map((file) => {
        file.source = 'formfile';
        return file;
      });
    });

    // This is basically an alternative of `flat()`.
    // See this: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
    const regular_files = nested_regular_files.reduce((acc, val) => acc.concat(val), []);

    // Changed line
    // this.all_files = $.merge(uppy_files, regular_files) || [];
    this.all_files = uppy_files.concat(regular_files);

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
        findElement(this.form, '#preventformsubmit').remove();
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

    this.all_files.forEach((file) => {
      // DEBUG
      // console.log(file);

      // Changed line
      // Single mock element guaranteed to be on the DOM.
      let mockEmitter = file.source === 'uppy'
        ? this.mockUppyEmitters[0]
        : this.mockFileEmitters[0];

      const controller = new DirectUploadController(mockEmitter, file);
      // const controller = new DirectUploadController(mockEmitter, filewrapper.data);
      controllers.push(controller);
    });
    return controllers;
  }

  dispatch(name, detail = {}) {
    return dispatchEvent(this.form, `direct-uploads:${name}`, {detail});
  }
}
