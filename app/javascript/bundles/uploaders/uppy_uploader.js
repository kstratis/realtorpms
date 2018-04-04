const Uppy = require('uppy/lib/core');
const Dashboard = require('uppy/lib/plugins/Dashboard');
// import '!style-loader!css-loader!uppy/dist/uppy.css';


$(document).on('turbolinks:load', function(e) {
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

  }).run();
  window.uppy_uploader = uppy;
});
