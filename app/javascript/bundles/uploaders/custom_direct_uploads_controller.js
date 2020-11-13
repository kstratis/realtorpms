/* This is basically a customized version of active_uploads_controller.js of activestorage. */
import {DirectUploadController} from "@rails/activestorage/src/direct_upload_controller";
import {dispatchEvent, findElement, findElements, toArray} from '@rails/activestorage/src/helpers';
import Compressor from 'compressorjs';

// Changed line
const uppySelector = "input[type=file][data-direct-upload-url].uppy-emitters:not([disabled])";
// Changed line
const fileSelector = "input[type=file][data-direct-upload-url].file-emitters:not([disabled])";

export class CustomDirectUploadsController {
  constructor(form) {
    this.form = form;
    // Changed line
    this.uppyDOMNodes = findElements(form, uppySelector);
    this.fileDOMNodes = findElements(form, fileSelector);

    // Changed line
    // Get file inputs with available files:
    // const activeFileInputs = $(fileSelector).filter((inputNo, input) => {return input.files.length});
    const activeFileInputs = this.fileDOMNodes.filter((input) => {
      return input.files.length
    });

    // Changed line
    // Get files from uppy:
    const uppy_files = Object.values(window.uppy_uploader.state.files).map((input) => {
      input.data.source = 'uppy';
      input.data['id'] = input.id;
      // .data is where the actual File object resides in
      return input.data
    });

    // Changed line
    this.inputs = activeFileInputs.concat(uppy_files.length ? this.uppyDOMNodes : [])

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
    this.all_files = uppy_files.concat(regular_files);
  }

  start(callback) {
    this.createUploadControllers().then((controllers) => {
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
    });
  }

  createUploadControllers() {
    // changed lines
    const promisesArray = [];

    this.all_files.forEach((file) => {
      promisesArray.push(
        new Promise((resolve, reject) => {
          new Compressor(file,
            {
              quality: 0.8,
              success: (result) => {
                file.compressed = result;
                return resolve(file);
              },
              error: (err) => {
                console.error(err);
                reject(err);
              }
            }
          );
        })
      );
    });

    return Promise.all(promisesArray).then((fileArray) => {
      const controllers = [];
      fileArray.forEach((file) => {
        let mockEmitter = file.source === 'uppy'
          ? this.uppyDOMNodes[0]
          : this.fileDOMNodes[0];
        const compressedFile = new File([file.compressed], file.name);
        compressedFile.id = file.id;

        const controller = new DirectUploadController(mockEmitter, compressedFile);
        controllers.push(controller);
      });
      return controllers; // or Promise.resolve(controllers);
    });
  }

  dispatch(name, detail = {}) {
    return dispatchEvent(this.form, `direct-uploads:${name}`, {detail});
  }
}
