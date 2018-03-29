import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import '!style-loader!css-loader!react-select/dist/react-select.css';

class SimpleSelect extends React.Component {

  static propTypes = {
    formdata: PropTypes.shape({
      formid: PropTypes.string.required,
      categoryid: PropTypes.string.required,
      subcategoryid: PropTypes.string.required
    }),
    i18n: PropTypes.shape({
      select: PropTypes.object.isRequired
    })
  };

  constructor(props) {
    super(props);
    this.setTextInputValue = this.setTextInputValue.bind(this);
  }

  setTextInputValue(value) {
    this.textInput.value = value;
  }

  state = {
    selectedOption: '',
  };

  updateExternalDOM = (selectedOption) => {
    // JQuery form validator specifics. Requires JQuery.
    // Manipulating a form element outside of this React component should be relatively safe
    const elementID = $(`#${this.props.inputID}`);
    const formID = $(`#${this.props.formdata.formid}`);

    // elementID.val(selectedOption.value ? selectedOption.value : '');
    this.setTextInputValue(selectedOption ? selectedOption.value : '');
    const validator = formID.validate();
    validator.element(elementID);
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.updateExternalDOM(selectedOption);
  };

  render() {
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;

    return (
      <div>
      <Select
        id={this.props.id}
        inputProps={{ 'data-name': this.props.name }}
        name={this.props.name}
        value={value}
        className={this.props.className}
        onChange={this.handleChange}
        options={this.props.options}
        placeholder={this.props.i18n.select.placeholder}
        disabled={this.props.disabled}
      />
      <input id={this.props.inputID}
          name={this.props.inputName}
          className="proxy-form-input"
          ref={(input) => { this.textInput = input; }}
      />
      </div>
    );
  }
}

export default SimpleSelect;

