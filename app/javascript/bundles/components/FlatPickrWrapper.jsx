import React from "react"
import flatpickr from "flatpickr";
import PropTypes from 'prop-types';
import { setFlatPickrSettings } from '../../packs/utilities';

class FlatPickrWrapper extends React.Component {

  componentDidMount() {
    this.renderFlatPickr();
  }

  renderFlatPickr(){
    const handleChange = this.props.handleChange.bind(this);
    const active_locale = $('#current_locale').data().i18n.locale || 'en';
    setFlatPickrSettings(active_locale === 'el' ? 'gr' : active_locale);

    window.flatpickr(".datetime", {
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