import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import { Async } from 'react-select';
import ReactOnRails from 'react-on-rails';
import { debounce } from '../utilities/helpers';
import '!style-loader!css-loader!react-select/dist/react-select.css';

class SimpleSelect extends React.Component {
  static propTypes = {
    identity: PropTypes.string,
    formID: PropTypes.string,
    inputID: PropTypes.string,
    inputName: PropTypes.string,
    validatorGroup: PropTypes.string,
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
    ajaxEnabled: PropTypes.bool,
    i18n: PropTypes.shape({
      select: PropTypes.object,
      validatorErrMsg: PropTypes.string
    })
  };

  constructor(props) {
    super(props);
    this.setTextInputValue = this.setTextInputValue.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateExternalDOM = this.updateExternalDOM.bind(this);
    this.handleAjaxRequestDelayed = debounce(this.handleAjaxRequest.bind(this), 300);
    axios.defaults.headers.common['X-CSRF-Token'] = ReactOnRails.authenticityToken();
  }

  // This stores a component reference so it can be used from the parent
  componentDidMount() {
    if (!this.props.soloMode) {
      this.props.onRef(this);
    }
    // Take care of the default value. Mind that you can't validate anything before the validation plugin sets up.
    // This is why on first render we don't validate anything. We basically defer until the validation plugin fully
    // loads on page load or the user clicks the form's submit button (which means that the plugin will have loaded by
    // then
    this.state.selectedOption ? this.updateExternalDOM(this.state.selectedOption, false) : '';

  }

  // Same as above but destroys the reference instead
  componentWillUnmount() {
    if (!this.props.soloMode) {
      this.props.onRef(undefined);
    }
    console.log(this.state.validator);
    this.state.validator.destroy();
  }

  state = {
    selectedOption: this.props.storedOption || '',
    validator: ''
  };

  // This operates outside react and is used to store the value
  // at the true input field which is eventually used by the rails form
  setTextInputValue(value) {
    this.textInput.value = value;
  }

  // This is called from DependantSelect to clear the component's value
  clearSelection() {
    this.setState({ selectedOption: '' });
  }

  handleAjaxRequest(query, callback) {
    axios
      .get(`/properties/locations.json?search=${query}`) // +1 because rails will_paginate starts from 1 while this starts from 0
      .then(response => {
        // DEBUG
        // console.log(response.data);
        callback(null, { options: response.data.locations.dataset });
      });
  }

  getOptions(input, callback) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }
    this.handleAjaxRequestDelayed(input, callback);
  }

  // This updates the true input field (which is hidden) according to the value selected.
  // It uses JQuery and is relatively safe to use since it's located outside of our React Component
  updateExternalDOM (selectedOption, validate = true)  {
    console.log('externaldom');
    // JQuery form validator specifics. Requires JQuery.
    // Manipulating a form element outside of this React component should be relatively safe
    let element = $(`#${this.props.inputID}`);
    let form = $(`#${this.props.formID}`);
    this.setTextInputValue(selectedOption ? selectedOption.value : '');
    if (validate) {
      console.log('select field changed - validating: ' +  this.props.inputID);
      // window.form_stepper.validateBy($('button.next'));
      // window.form_stepper.validateBy('', this.props.dataParsleyGroup, false);
      // window.form_stepper.form.refresh();
      window.form_stepper.validateField(this.props.inputID);
      // window.form_stepper.form.reset();

      // $('#stepper-form')
      //   .parsley()
      //   .on('form:validate', function(formInstance) {
      //     console.log('form:validate running');
      //     const isValid = formInstance.isValid({ group: 'fieldset01' })
      //     console.log(isValid);
      //   });



      // this.form_stepper.validateBy();
      // element.parsley().on('field:validate', function(fieldInstance){
        // const isValid = formInstance.isValid({
        //   group: group
        // });
        // console.log('Parsley checking');

      // });
      // const validator = form.validate();
      // this.setState({ validator }, () => {
      //   validator.element(element);
        // DEBUG
        // console.log($(`#${this.props.inputID}`).val());
      // });
    }
  };

  // This is called on every value change to update the current value and the "true" hidden input field.
  // If it is the parent dropdown that is change it will also call the handleOptions from DependantSelect
  // to update the childen's dropdown values accordingly
  handleChange (selectedOption) {
    // selectedOption is an object of type: {label: "Πώληση", value: "sell"}
    // Whenever locations are concerned, value is the id, and not the area_id.
    // check if we are dealing with dependant or solo select
    if (!this.props.soloMode) {
      if (typeof this.props.handleOptions === 'function') {
        this.props.handleOptions(selectedOption, this.props.isMaster);
      }
    }
    this.setState({ selectedOption }, () => {
      this.updateExternalDOM(this.state.selectedOption);
    });
  };

  render() {
    const opts = {
      required: !!this.props.isRequired
    };
    console.log(this.props.validatorGroup);
    console.log(this.props.i18n.validatorErrMsg);

    return (
      <div>
        {!this.props.ajaxEnabled ? (
          <Select
            id={this.props.identity}
            inputProps={{ 'data-name': this.props.name }}
            name={this.props.name}
            value={this.state.selectedOption}
            className={this.props.className}
            onChange={this.handleChange}
            options={this.props.options}
            placeholder={this.props.i18n.select.placeholder}
            disabled={this.props.disabled}
            searchable={this.props.searchable}
          />
        ) : (
          <Async
            id={this.props.identity}
            inputProps={{ 'data-name': this.props.name }}
            name={this.props.name}
            value={this.state.selectedOption}
            className={this.props.className}
            onChange={this.handleChange}
            loadOptions={this.getOptions}
            placeholder={this.props.i18n.select.placeholder}
            disabled={this.props.disabled}
            searchable={this.props.searchable}
            autoload={false}
            cache={false}
            // https://github.com/JedWatson/react-select#note-about-filtering-async-options
            filterOptions={(options, filter, currentValues) => {
              // Do no filtering, just return all options
              return options;
            }}
          />
        )}
        <input
          id={this.props.inputID}
          name={this.props.inputName}
          className={`proxy-form-input ${this.props.inputClassName}`}
          data-parsley-group={this.props.validatorGroup}
          data-parsley-required-message={this.props.i18n.validatorErrMsg}
          ref={input => {
            this.textInput = input;
          }}
          {...opts}
        />
        <small className="form-text text-muted">{this.props.feedback}</small>
        <div className="invalid-feedback"></div>
      </div>
    );
  }
}

export default SimpleSelect;
