import { DirectUpload } from "activestorage";

export class UploadController {
  constructor(input, file) {
    this.input = input;
    this.file = file;
    this.directUpload = new DirectUpload(this.file, this.url, this);
    this.dispatch('initialize');
  }

  start(callback) {
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = this.input.name;
    this.input.insertAdjacentElement('beforebegin', hiddenInput);

    this.dispatch('start');

    this.directUpload.create((error, attributes) => {
      if (error) {
        hiddenInput.parentNode.removeChild(hiddenInput);
        this.dispatchError(error);
      } else {
        hiddenInput.value = attributes.signed_id;
      }

      this.dispatch('end');
      callback(error);
    });
  }
}
