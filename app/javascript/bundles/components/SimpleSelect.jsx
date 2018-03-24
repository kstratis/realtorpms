import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import '!style-loader!css-loader!react-select/dist/react-select.css';

class SimpleSelect extends React.Component {

  static propTypes = {
    formdata: PropTypes.shape({
      elementid: PropTypes.string.isRequired,
      formid: PropTypes.string.isRequired,
    }),
    i18n: PropTypes.shape({
      select: PropTypes.object.isRequired
    })
  };

  state = {
    selectedOption: '',
  };
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    // JQuery form validator specifics. Requires JQuery.
    // Manipulating a form element outside of this React component should be relatively safe
    document.getElementById(`${this.props.formdata.elementid}`).value = selectedOption ? selectedOption.value : '';
    $(`#${this.props.formdata.formid}`).valid();
  };
  render() {
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;

    return (
      <Select
        id={this.props.id}
        inputProps={{ 'data-name': this.props.name }}
        name={this.props.name }
        value={value}
        className={this.props.className}
        onChange={this.handleChange}
        options={this.props.options}
        placeholder={this.props.i18n.select.placeholder}
      />
    );
  }
}

export default SimpleSelect;

