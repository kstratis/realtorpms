import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import '!style-loader!css-loader!react-select/dist/react-select.css';

class SimpleSelect extends React.Component {

  static propTypes = {
    formID: PropTypes.string,
    inputID: PropTypes.string.isRequired,
    inputName: PropTypes.string.isRequired,
    options: PropTypes.array,
    handleOptions: PropTypes.func,
    onRef: PropTypes.func,
    i18n: PropTypes.shape({
      select: PropTypes.object.isRequired
    })
  };

  constructor(props) {
    super(props);
    this.setTextInputValue = this.setTextInputValue.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
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
    const element = $(`#${this.props.inputID}`);
    const form = $(`#${this.props.formID}`);

    // elementID.val(selectedOption.value ? selectedOption.value : '');
    this.setTextInputValue(selectedOption ? selectedOption.value : '');
    const validator = form.validate();
    validator.element(element);
  };

  handleChange = (selectedOption) => {
    this.setState({selectedOption});
    this.updateExternalDOM(selectedOption);
    console.log(selectedOption);
    // check if we are dealing with dependant or solo select
    if (typeof this.props.handleOptions === "function") {
      this.props.handleOptions(selectedOption, this.props.controller);
    }
  };

  clearValue = () => {
    this.select.setInputValue('');
  };

  render() {
    const {selectedOption} = this.state;
    const value = selectedOption && selectedOption.value;
    // const value = selectedOption;

    return (
      <div>
        <Select
          id={this.props.identity}
          inputProps={{'data-name': this.props.name}}
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
               ref={(input) => {
                 this.textInput = input;
               }}
        />
      </div>
    );
  }
}

export default SimpleSelect;

