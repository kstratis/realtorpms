import flatpickr from "flatpickr";

// 1241 - 1428 lines @ app/assets/stylesheets/components/_plugins.scss contains the theme (looper) overriden variables
// of the flatpickr plugin. However since the plugin updated, the theme's overrides fell out so we commented out that
// section and started using the defaults

const datePicking = {

  init () {
    this.bindUIActions()
  },

  bindUIActions () {
    this.handleFlatpickr()
  },

  _fp1 () {
    console.log('running');
    flatpickr('#avail', {
      disableMobile: true, // always use the non-native picker
    })
  },

  // _fp2 () {
  //   // DateTime
  //   return flatpickr('#flatpickr02', {
  //     disableMobile: true, // always use the non-native picker
  //     enableTime: true,
  //     dateFormat: 'Y-m-d H:i',
  //   })
  // },
  //
  // _fp3 () {
  //   // Human-friendly Dates
  //   return flatpickr('#flatpickr03', {
  //     disableMobile: true,
  //     altInput: true,
  //     altFormat: 'F j, Y',
  //     dateFormat: 'Y-m-d'
  //   })
  // },

  handleFlatpickr () {
    this._fp1();
    // This is for datepickers in future pages
    // this._fp2()
    // this._fp3()
  }
};

export default datePicking;
