import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import '!style-loader!css-loader!react-select/dist/react-select.css';

class SimpleSelect extends React.Component {

  static propTypes = {
    identity: PropTypes.string,
    formID: PropTypes.string,
    inputID: PropTypes.string,
    inputName: PropTypes.string,
    isMaster: PropTypes.bool,
    options: PropTypes.array,
    handleOptions: PropTypes.func,
    disabled: PropTypes.bool,
    onRef: PropTypes.func,
    searchable: PropTypes.bool,
    storedOption: PropTypes.any,
    // soloMode guards against dynamically setting the dropdown options
    // and gettings a ref which is needed in DependantSelect
    soloMode: PropTypes.bool,
    i18n: PropTypes.shape({
      select: PropTypes.object
    })
  };

  constructor(props) {
    super(props);
    this.setTextInputValue = this.setTextInputValue.bind(this);
  }

  // This stores a component reference so it can be used from the parent
  componentDidMount() {
    if (!this.props.soloMode) {
      this.props.onRef(this)
    }
    // Take care of the default value
    this.state.selectedOption ? this.updateExternalDOM(this.state.selectedOption) : '';
  }

  // Same as above but destroys the reference instead
  componentWillUnmount() {
    if (!this.props.soloMode) {
      this.props.onRef(undefined)
    }
  }

  state = {
    selectedOption: this.props.storedOption || '',
    // selectedOption: this.props.soloMode
    //   ? this.props.storedOption || ''
    //   :
    // selectedOption: '',
  };

  // This operates outside react and is used to store the value
  // at the true input field which is eventually used by the rails form
  setTextInputValue(value) {
    this.textInput.value = value;
  }

  // This is called from DependantSelect to clear the component's value
  clearSelection() {
    this.setState({selectedOption: ''});
  }



  // This updates the true input field (which is hidden) according to the value selected.
  // It uses JQuery and is relatively safe to use since it's located outside of our React Component
  updateExternalDOM = (selectedOption) => {
    // JQuery form validator specifics. Requires JQuery.
    // Manipulating a form element outside of this React component should be relatively safe
    const element = $(`#${this.props.inputID}`);
    const form = $(`#${this.props.formID}`);
    console.log(element);
    console.log(form);
    this.setTextInputValue(selectedOption ? selectedOption.value : '');
    const validator = form.validate();
    validator.element(element);
    console.log($(`#${this.props.inputID}`).val())
  };

  // This is called on every value change to update the current value and the "true" hidden input field.
  // If it is the parent dropdown that is change it will also call the handleOptions from DependantSelect
  // to update the childen's dropdown values accordingly
  handleChange = (selectedOption) => {
    // selectedOption is an object of type: {label: "Πώληση", value: "sell"}
    // check if we are dealing with dependant or solo select
    if (!this.props.soloMode) {
      if (typeof this.props.handleOptions === "function") {
        this.props.handleOptions(selectedOption, this.props.isMaster);
      }
    }
    this.setState({selectedOption}, () => {
      this.updateExternalDOM(this.state.selectedOption);
    });
  };

  render() {
    // const {selectedOption} = this.state;
    // const value = selectedOption && selectedOption.value;
    // console.log(value);
    return (
      <div>
        <Select
          id={this.props.identity}
          inputProps={{'data-name': this.props.name}}
          name={this.props.name}
          value={this.state.selectedOption}
          className={this.props.className}
          onChange={this.handleChange}
          options={this.props.options}
          placeholder={this.props.i18n.select.placeholder}
          disabled={this.props.disabled}
          searchable={this.props.searchable}
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

