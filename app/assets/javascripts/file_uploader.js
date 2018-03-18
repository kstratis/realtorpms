// $(document).on('turbolinks:load', function(e){
//   var uppy = Uppy.Core({ debug: true });
//   uppy.use(Uppy.DragDrop, {
//     target: '.UppyDragDrop',
//     locale: {
//       strings: {
//         dropHereOr: 'Перенесите файлы сюда или',
//         browse: 'выберите'
//       }
//     }
//   });
//   uppy.use(Uppy.ProgressBar, { target: '#property_images', fixed: true, hideAfterFinish: false });
//   uppy.use(Uppy.Tus, { endpoint: '/properties' });
//   uppy.run();
//
//   console.log('--> Uppy pre-built version with Tus, DragDrop & Russian language pack has loaded');
// });

$(document).on('turbolinks:load', function(e) {
  console.log('FIRED');
  var randomdate = Date.now();
  addEventListener("direct-upload:initialize", event => {
    console.log('ADDED');
    const {target, detail} = event;
    const {id, file} = detail;
    console.log(file.id)
    window.uppy_uploader.emit('upload-started', window.uppy_uploader.getState().files[file.id], {
      uploader: 'activestorage',
      bytesUploaded: 0,
      bytesTotal: file.size
    });
  //   document.getElementById('ppp').insertAdjacentHTML("beforebegin", `
  //   <div id="direct-upload-${id}" class="direct-upload direct-upload--pending">
  //     <div id="direct-upload-progress-${id}" class="direct-upload__progress" style="width: 0%"></div>
  //     <span class="direct-upload__filename">${file.name}</span>
  //   </div>
  // `)
  });

  addEventListener("direct-upload:start", event => {
    const {id} = event.detail;
    // const element = document.getElementById(`direct-upload-${id}`);
    // element.classList.remove("direct-upload--pending")



  });

  addEventListener("direct-upload:progress", event => {
    const {id, file, progress, bytesUploaded} = event.detail;
    window.uppy_uploader.emit('upload-progress', window.uppy_uploader.getState().files[file.id], {
      uploader: 'activestorage',
      bytesUploaded: bytesUploaded,
      bytesTotal: file.size,
      uploadStarted: randomdate,
      uploadCompleted: false
    });
    // console.log(file);
    // window.window.uppy_uploader_uploader.setState({
    //   totalProgress: 50
    // });
    // console.log(`The progress is: ${progress}`);
    // const progressElement = document.getElementById(`direct-upload-progress-${id}`);
    // progressElement.style.width = `${progress}%`
  });

  addEventListener("direct-upload:error", event => {
    event.preventDefault();
    const {id, error} = event.detail;
    const element = document.getElementById(`direct-upload-${id}`);
    element.classList.add("direct-upload--error");
    element.setAttribute("title", error)
  });

  addEventListener("direct-upload:end", event => {
    const {id, file} = event.detail;
    window.uppy_uploader.emit('upload-success', window.uppy_uploader.getState().files[file.id], { message: 'complete'});
    // const element = document.getElementById(`direct-upload-${id}`);
    // element.classList.add("direct-upload--complete");
  });
});