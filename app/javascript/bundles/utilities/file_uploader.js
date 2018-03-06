const Uppy = require('uppy/lib/core');
// const DragDrop = require('uppy/lib/plugins/DragDrop')
const Dashboard = require('uppy/lib/plugins/Dashboard');
const XHRUpload = require('uppy/lib/plugins/XHRUpload');
const FileInput = require('uppy/lib/plugins/FileInput');
const ProgressBar = require('uppy/lib/plugins/ProgressBar');
const ThumbnailGenerator = require('uppy/lib/plugins/ThumbnailGenerator');

// const Tus = require('uppy/lib/plugins/Tus');


document.addEventListener('turbolinks:load', () => {
  // const uppy = Uppy({
  //   autoProceed: false,
  //   debug: true
  // })
  //   .use(Dashboard, {
  //     // target: 'body',
  //
  //     target: "#files_upload",
  //     inline: true,
  //     // trigger: "#test",
  //     plugins: [],
  //     maxWidth: 750,
  //     maxHeight: 550,
  //     semiTransparent: false,
  //     showProgressDetails: false,
  //     hideUploadButton: false,
  //     hideProgressAfterFinish: false,
  //     note: null
  //   })
  //   .use(XHRUpload, {
  //     endpoint: '/properties/uploads'
  //   })
  //   // .use(Tus, {endpoint: '/properties'})
  //   .run();
  //
  // uppy.on('complete', (result) => {
  //   console.log(`Upload complete! We’ve uploaded these files: ${result.successful}`)
  // });

  // const uppy = new Uppy({ debug: true, autoProceed: true })
  // uppy.use(FileInput, { target: '#uuu', replaceTargetContent: true });
  // uppy.use(XHRUpload, {
  //   endpoint: '//api2.transloadit.com',
  //   formData: true,
  //   fieldName: 'files[]'
  // });
  // uppy.use(ThumbnailGenerator, { thumbnailWidth: 100 });
  // uppy.use(ProgressBar, {
  //   target: 'body',
  //   fixed: true,
  //   hideAfterFinish: false
  // });
  // uppy.run();
  //
  //
  // uppy.on('file-added', function (file) {
  //   console.log('fired');
  //   // var img1 = document.getElementById('previe')
  //   // img1.src = file.preview
  //
  //   var img2 = document.getElementById('kkk');
  //   var reader = new FileReader();
  //   reader.onload = function(e) { img2.src = e.target.result }
  //   reader.readAsDataURL(file.data)
  // })


});


// export default uppy;