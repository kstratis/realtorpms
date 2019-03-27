const Uppy = require('@uppy/core');
const Dashboard = require('@uppy/dashboard');
import { DirectUpload } from "activestorage";
// import { start } from '../bundles/activestorageModifiedv52/';

$(document).on('turbolinks:load', function(e) {

  const input = document.querySelector('input[type=file]');

  const uppyDomNode = $('#uppy');
  // Bail out if uppy shouldn't be included in this screen
  if (window.location.pathname !== uppyDomNode.data('uppyUrlListener')) return;
  const translations = uppyDomNode.data('i18n').uppy;
  const uppy = Uppy({
    debug: false,
    editable: false,
    autoProceed: false,
    restrictions: {
      maxFileSize: 2000000,
      maxNumberOfFiles: 20,
      allowedFileTypes: ['image/*']
    }
  }).use(Dashboard, {
    inline: true,
    target: '#uppy',
    hideUploadButton: true,
    disableInformer: true,
    disableStatusBar: true,
    showProgressDetails: false,
    hideProgressAfterFinish: true,
    locale: {
      strings: {
        name: translations.filename,
        editing: `${translations.editing} %{file}`,
        dropPaste: `${translations.dropPaste} %{browse}`,
        browse: translations.browse,
        done: translations.done,
        cancel: translations.cancel,
        xFilesSelected: {
          0: `%{smart_count} ${translations.singleFileSelected}`,
          1: `%{smart_count} ${translations.multipleFilesSelected}`
        },
        uploadXFiles: {
          0: translations.uploadSingleFile,
          1: translations.uploadMultipleFiles
        },
        uploadXNewFiles: {
          0: translations.uploadSingleFileExtra,
          1: translations.uploadMultipleFilesExtra
        },
        uploading: translations.uploading,
        uploadComplete: translations.uploadComplete,
        uploadFailed: translations.uploadFailed,
        pleasePressRetry: translations.pleasePressRetry,
        paused: translations.paused,
        error: translations.error,
        retry: translations.retry
      }
    },
    note: translations.notes,
    replaceTargetContent: true,
    width: '100%',
    // maxHeight: 550,

  }).run();
  window.uppy_uploader = uppy;

  const uploadFile = (file) => {
    console.log('uploadFile method called');
    // your form needs the file_field direct_upload: true, which
    //  provides data-direct-upload-url
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
        hiddenField.setAttribute('value', blob.signed_id);
        hiddenField.name = input.name;
        document.querySelector('form').appendChild(hiddenField);
      }
    });
  };

  uppy.on('file-added', (file) => {

    console.log('Added file', file);

    console.log(file);

    uploadFile(file.data);
  });

  $('.submit').on('click', function(e){
    console.log('custom handler fired');
    e.preventDefault();
  })

});


