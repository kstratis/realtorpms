import { DirectUploadController } from "./direct_upload_controller"
import { findElements, dispatchEvent, toArray } from "./helpers"

// const inputSelector = "input[type=file][data-direct-upload-url]:not([disabled])";
// const inputSelector = document.getElementById('inputEmitter');
// const inputSelector = document.getElementsByClassName('emitters');
// const inputSelector = ['.emitters'];
const inputSelector = "input.emitters:not([disabled]";
// var y = document.getElementsByClassName('foo');

export class DirectUploadsController {
  constructor(form) {
    this.form = form;
    console.log('Inside DirectUploadsController constructor');
    this.inputs = findElements(form, inputSelector);
    // this.inputs = findElements(form, inputSelector).filter(input => input.files.length);
    // this.inputs = findElements(form, inputSelector).filter(input => true);
    // console.log(typeof this.inputs);
    console.log('#####');
    console.log(this.inputs.constructor);
    console.log(this.inputs);
    console.log('#####');

    // console.log(DirectUploadsController.caller);
    // this.inputs = inputSelector;
  }

  start(callback) {
    const controllers = this.createDirectUploadControllers()

    const startNextController = () => {
      const controller = controllers.shift()
      if (controller) {
        controller.start(error => {
          if (error) {
            callback(error)
            this.dispatch("end")
          } else {
            startNextController()
          }
        })
      } else {
        console.log('no other controller');
        callback();
        this.dispatch("end")
      }
    }

    this.dispatch("start")
    startNextController()
  }

  createDirectUploadControllers() {
    // console.log('******************************');
    // console.log(window.uppy_uploader.state.files);
    // console.log('******************************');
    console.log('------------------------------');
    console.log(this.inputs);
    console.log('------------------------------');

    const controllers = [];
    const mockEmitter = this.inputs[0];
    $.each(window.uppy_uploader.state.files, (uppyfilename, filewrapper) => {
      console.log(filewrapper.data);
      filewrapper.data['id'] = filewrapper.id;
        // toArray(input.files).forEach(file => {
        // const controller = new DirectUploadController(input, filewrapper.data);

      const controller = new DirectUploadController(mockEmitter, filewrapper.data);
      controllers.push(controller)
        // })

    });
    return controllers
  }

  // Original Method
  // createDirectUploadControllers() {
  //   const controllers = [];
  //   this.inputs.forEach(input => {
  //     toArray(input.files).forEach(file => {
  //       const controller = new DirectUploadController(input, file);
  //       controllers.push(controller)
  //     })
  //   });
  //   return controllers
  // }

  dispatch(name, detail = {}) {
    return dispatchEvent(this.form, `direct-uploads:${name}`, { detail })
  }
}
