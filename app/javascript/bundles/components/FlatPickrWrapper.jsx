import React from "react"
import flatpickr from "flatpickr";
import PropTypes from 'prop-types';

class FlatPickrWrapper extends React.Component {

  componentDidMount() {
    this.renderFlatPickr();
  }

  // componentDidUpdate() {
    // this.renderFlatPickr();
    // console.log('didupdate fired');
  // }

  renderFlatPickr(){
    const handleChange = this.props.handleChange.bind(this);
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
    flatpickr(".datetime", {
      onChange: function(dateObj, dateStr) {
        handleChange({dateObj, dateStr})
        // DEBUG
        // console.info(dateObj);
        // console.info(dateStr);
      }
    });
  }

  render() {
    return null
  }
}

FlatPickrWrapper.propTypes = {
  handleChange: PropTypes.func.isRequired
};

export default FlatPickrWrapper;