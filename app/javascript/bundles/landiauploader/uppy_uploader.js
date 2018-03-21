import { start } from "./ujs"
import { DirectUpload } from "./direct_upload"
const Uppy = require('uppy/lib/core');
const Dashboard = require('uppy/lib/plugins/Dashboard');
const XHRUpload = require('uppy/lib/plugins/XHRUpload');
const Form = require('uppy/lib/plugins/Form');


export { start, DirectUpload }



$(document).on('turbolinks:load', function(e) {

  function autostart() {
    // if (window.ActiveStorage) {
      start()
    // }
  }

  setTimeout(autostart, 1);

  const uppyDomNode = $('#uppy');
  // Bail out if uppy shouldn't be included in this screen
  if (window.location.pathname !== uppyDomNode.data('uppyUrlListener')) return;
  const translations = uppyDomNode.data('i18n').uppy;
  const uppy = Uppy({
    debug: true,
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
        editing: translations.editing,
        dropPaste: translations.dropPaste,
        browse: translations.browse,
        done: translations.done,
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
    maxHeight: 450,

  })
  //   .use(XHRUpload, {
  //   endpoint: '/properties',
  //   bundle: true,
  //   formData: true,
  //   fieldName: 'images[]',
  //   headers: {
  //     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  //   }
  // })
    .run();
    // .on('complete', (result) => {
    //   console.log('Upload result:', result)
    // });
  // uppy.on('upload-started', (file, upload) => {
  //   console.log('I got the start');
  //   console.log('the upload is:');
  //   console.log(upload);
  //   uppy.setFileState(file.id, {
  //     progress: Object.assign({}, file.progress, {
  //       uploadStarted: Date.now(),
  //       uploadComplete: false,
  //       bytesUploaded: upload.bytesUploaded,
  //       bytesTotal: file.size
  //     })
  //   })
  // });
  //
  // uppy.on('upload-progress', (file, progress) => {
  //   console.log('I got progress!!!!');
  //   console.log(progress);
  //   uppy.setFileState(file.id, {
  //     progress: Object.assign({}, file.progress, {
  //       bytesUploaded: upload.bytesUploaded,
  //       bytesTotal: file.size,
  //       percentage: Math.floor((upload.bytesUploaded / 600000 * 100).toFixed(2))
  //     })
  //   });
  // });
  // uppy.on('file-added', (file) => {
  //   console.log('Added file', file)
  // });





  window.uppy_uploader = uppy;
});



// uppy.setFileState('uppy-kleidariapng-image/png-114836-1519211548209', { progress: 95  });





// .use(XHRUpload, {
//   endpoint: 'uploads',
//   bundle: true,
//   formData: true,
//   headers: {
//     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//   }
// })