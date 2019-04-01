import { DirectUpload } from 'activestorage';
import { UploadsController } from 'uploads_controller';
const processingAttribute = 'data-direct-uploads-processing';

const uploadFile = (file) => {
  // console.log('uploadFile method called');
  // your form needs the file_field direct_upload: true, which
  //  provides data-direct-upload-url
  console.log(input);
  const url = input.dataset.directUploadUrl;
  const upload = new DirectUpload(file, url);

  upload.create((error, blob) => {
    if (error) {
      console.warn(error);
      // Handle the error
    } else {
      console.log('file successfully ajaxed');

      // Add an appropriately-named hidden input to the form with a
      //  value of blob.signed_id so that the blob ids will be
      //  transmitted in the normal upload flow
      const hiddenField = document.createElement('input');
      hiddenField.setAttribute('type', 'hidden');
      // hiddenField.setAttribute('name', 'property[images][]');
      hiddenField.setAttribute('value', blob.signed_id);
      hiddenField.name = input.name;
      document.querySelector('form').appendChild(hiddenField);

    }
  });
};


// ---------------------------------------------------------------

// uppy.on('file-added', (file) => {
//
//   console.log('Added file', file);
//
//   console.log(file);
//
//   // uploadFile(file.data);
// });


$(document).on('submit', function(event){
  console.log('Form submit event fired!');
  const form = event.target;

  if (form.hasAttribute(processingAttribute)) {
    event.preventDefault();
    return;
  }

  const controller = new UploadsController(form);
  const { inputs } = controller;

  // if (inputs.length) {
  //   event.preventDefault()
  //   form.setAttribute(processingAttribute, "")
  //   inputs.forEach(disable)
  //   controller.start(error => {
  //     form.removeAttribute(processingAttribute)
  //     if (error) {
  //       inputs.forEach(enable)
  //     } else {
  //       submitForm(form)
  //     }
  //   })
  // }





  $.each(window.uppy_uploader.state.files, (uppyfilename, filewrapper) => {
    uploadFile(filewrapper.data);
  });

  // console.log('submitting');
  // $('form').submit();

});