import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import '!style-loader!css-loader!react-select/dist/react-select.css';

class SimpleSelect extends React.Component {

  static propTypes = {
    identity: PropTypes.string,
    formID: PropTypes.string,
    inputID: PropTypes.string.isRequired,
    inputName: PropTypes.string.isRequired,
    controller: PropTypes.bool,
    options: PropTypes.array,
    handleOptions: PropTypes.func,
    disabled: PropTypes.bool.isRequired,
    onRef: PropTypes.func,
    i18n: PropTypes.shape({
      select: PropTypes.object.isRequired
    })
  };

  constructor(props) {
    super(props);
    this.setTextInputValue = this.setTextInputValue.bind(this);
  }

  // This stores a component reference so it can be used from the parent
  componentDidMount() {
    this.props.onRef(this)
  }

  // Same as above but destroys the reference instead
  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  // This operates outside react and is used to store the value
  // at the true input field which is eventually used by the rails form
  setTextInputValue(value) {
    this.textInput.value = value;
  }

  // This is called from DependantSelect to clear the component's value
  clearSelection () {
    this.setState({selectedOption: ''});
  }

  state = {
    selectedOption: '',
  };

  // This updates the true input field (which is hidden) according to the value selected.
  // It used JQuery and is relatively safe to use since it's located outside of our React Component
  updateExternalDOM = (selectedOption) => {
    // JQuery form validator specifics. Requires JQuery.
    // Manipulating a form element outside of this React component should be relatively safe
    const element = $(`#${this.props.inputID}`);
    const form = $(`#${this.props.formID}`);
    this.setTextInputValue(selectedOption ? selectedOption.value : '');
    const validator = form.validate();
    validator.element(element);
  };

  // This is called on every value change to update the current value and the "true" hidden input field.
  // If it is the parent dropdown that is change it will also call the handleOptions from DependantSelect
  // to update the childen's dropdown values accordingly
  handleChange = (selectedOption) => {
    this.setState({selectedOption});
    this.updateExternalDOM(selectedOption);
    // check if we are dealing with dependant or solo select
    if (typeof this.props.handleOptions === "function") {
      this.props.handleOptions(selectedOption, this.props.controller);
    }
  };

  render() {
    const {selectedOption} = this.state;
    const value = selectedOption && selectedOption.value;
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
          searchable={false}
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

