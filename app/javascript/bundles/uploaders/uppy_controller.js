const Uppy = require('@uppy/core');
const Dashboard = require('@uppy/dashboard')

export default class UppyLoader {
  constructor() {
    const uppyDomNode = $('#uppy');
    // Bail out if uppy shouldn't be included in this screen
    if (window.location.pathname !== uppyDomNode.data('uppyUrlListener')) return;
    const translations = uppyDomNode.data('i18n').uppy;
    const file_count = uppyDomNode.data('currentServerFileCount');
    const uppy = this.start(translations, file_count);
    uppy.on('upload-started', (data) => {
      // Prevents any further user intervention which could mess
      // with the state of the form
      $('.form-container').addClass('disabled');
    })
    window.uppy_uploader = uppy;
  }

  start(translations, file_count) {
    return Uppy({
      debug: false,
      editable: false,
      autoProceed: false,
      restrictions: {
        maxFileSize: 3700000,
        maxNumberOfFiles: 10 - parseInt(file_count),
        allowedFileTypes: ['image/*']
      },
      // exceedsSize is a Core locale string, so it needs to be passed to the Uppy constructor directly.
      // https://github.com/transloadit/uppy/issues/654#issuecomment-368509043
      locale: {
        strings: {
          exceedsSize: translations.exceedsSize,
          noDuplicates: translations.noDuplicates,
          youCanOnlyUploadX: {
            0: translations.maxFileCountSingle,
            1: translations.maxFileCountMulti
          }
        }
      }
    }).use(Dashboard, {
      inline: true,
      target: '#uppy',
      hideUploadButton: true,
      disableInformer: false,
      disableStatusBar: true,
      showProgressDetails: false,
      proudlyDisplayPoweredByUppy: false,
      hideProgressAfterFinish: true,
      hideCancelButton: true,
      locale: {
        strings: {
          addMore: translations.addMore,
          addingMoreFiles: translations.addingMoreFiles,
          back: translations.back,
          name: translations.filename,
          dropHint: translations.dropHint,
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
          uploadingXFiles: {
            0: translations.uploadingSingleFile,
            1: translations.uploadingMultipleFiles
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
  }
}
