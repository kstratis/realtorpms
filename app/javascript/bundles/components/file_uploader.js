const Uppy = require('uppy/lib/core');
const Dashboard = require('uppy/lib/plugins/Dashboard');
const XHRUpload = require('uppy/lib/plugins/XHRUpload');

$(document).on('turbolinks:load', function(e) {

  const uppy = Uppy({
    debug: true,
    autoProceed: true,


    restrictions: {
      maxFileSize: 2000000,
      maxNumberOfFiles: 10,
      allowedFileTypes: ['image/*']
    }
  }).use(Dashboard, {
    inline: true,
    target: '#uppy',
    replaceTargetContent: true,
    note: 'Images and video only, 2–3 files, up to 2 MB',
    maxHeight: 450,
    metaFields: [
      {id: 'license', name: 'License', placeholder: 'specify license'},
      {id: 'caption', name: 'Caption', placeholder: 'describe what the image is about'}
    ]
  }).use(XHRUpload, {
    endpoint: 'uploads',
    bundle: true,
    formData: true,
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  }).run()
    .on('complete', (result) => {
      console.log('Upload result:', result)
    })
});

// export default uppy;