import React from "react"
import flatpickr from "flatpickr";


class FlatPickrWrapper extends React.Component {

  componentDidMount() {
    this.renderFlatPickr();
  }

  componentDidUpdate() {
    // this.renderFlatPickr();
    console.log('didupdate fired');
  }

  renderFlatPickr(){
    console.log('render fired');
    let active_locale = $('#current_locale').data().i18n.locale || 'en';
    if (active_locale !== 'en') {
      if (active_locale === 'el') {
        flatpickr.defaultConfig.locale = 'gr';
        // flatpickr.defaultConfig.dateFormat = "l, d M Y";
        flatpickr.defaultConfig.dateFormat = 'Z';
        flatpickr.defaultConfig.altInput = true;
        flatpickr.defaultConfig.altFormat = 'l, d M Y';
      } else {
        console.warn('Unknown lang selected for pickers.');
        // Need to load the lang and set it as
        // flatpickr.defaultConfig.locale = active_locale
      }
    }
    flatpickr(".datetime");
    // const nodelist = $("[class*='clamp-']");
    // if (nodelist.length < 1) return;
    // const regex = /clamp-(\d+)/;
    // let lineno = 2;
    // nodelist.each(function (index, element) {
    //   try {
    //     lineno = parseInt(regex.exec(element.className)[1]);
    //   } catch (e) {
    //     console.warn('Unable to determine the clamp line value. Make sure classes that clamp text obey the clamp-* rule');
    //   }
    //   $clamp(element,
    //     {
    //       'clamp': lineno,
    //       'useNativeClamp': true,
    //     });
    // });
  }

  render() {
    return null
  }
}

export default FlatPickrWrapper;