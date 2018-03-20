$(document).on('turbolinks:load', function(e) {
  console.log('FORM SUBMITTER FIRING');

  $('#new_property').on("ajax:before", event => {
    console.log('************');
    console.log('This is the ajax:before event logged');

    if ($('#nonformsubmitter').length > 0) {
      console.log('exists');
      event.preventDefault();
      return false;
    }
    // console.log('This is the event: ');
//     console.log(event);
    console.log('************');
  });

  $('#new_property').on("ajax:send", event => {
    console.log('************');
    console.log('This is the ajax:send event logged');
    // console.log('This is the event: ');
//     console.log(event);
    console.log('************');
  });
//   $('#new_property').on("ajax:success", event => {
//     console.log('************');
//     console.log('This is the ajax:success event logged');
//     // console.log('This is the event: ');
// //     console.log(event);
//     console.log('************');
//   });
//   $('#new_property').on("ajax:error", event => {
//     console.log('************');
//     console.log('This is the ajax:error event logged');
//     console.log(event);
//     // console.log('This is the event: ');
// //     console.log(event);
//     console.log('************');
//   });
//   $('#new_property').on("ajax:complete", event => {
//     console.log('************');
//     console.log('This is the ajax:complete event logged');
//     // console.log('This is the event: ');
// //     console.log(event);
//     console.log('************');
//   });
});
//     // e.preventDefault();
//
//     console.log('RUNNNNNNNNNNNING');
//     let progress = `<div>
//       <div id="ppp" class="progress-container">
//       </div>
//     </div>`;
//
//     $('#uppy').fadeOut();
//     // $('#uppy').fadeOut('fast', function(){
//     //   $(progress).fadeIn();
//     // })
// //     console.log('existing data');
// //     console.log(e);
// //     console.log(xhr);
// //     console.log(settings);
//     // var formData = new FormData(jsonData.data);
//     // formData.append('userpic', myFileInput.files[0], 'chris.jpg');
//     // settings.data +=
//
//     // $.parseJSON(jsonData.data);
//     // console.log(JSON.parse(jsonData.data));
//     // console.log(xhr);
//     // window.uppy_uploader.setMeta({ meta: { token: '123' } });
//     // console.log(window.uppy_uploader.state.files);
//     // window.uppy_uploader.upload();
//     // return false;

