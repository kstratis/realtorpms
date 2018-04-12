import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Async } from 'react-select';
import ReactOnRails from "react-on-rails";
import { debounce } from "../utilities/helpers";
import '!style-loader!css-loader!react-select/dist/react-select.css';


class SimpleSelect extends React.Component {

  static propTypes = {
    identity: PropTypes.string,
    formID: PropTypes.string,
    inputID: PropTypes.string,
    inputName: PropTypes.string,
    controller: PropTypes.bool,
    options: PropTypes.array,
    handleOptions: PropTypes.func,
    disabled: PropTypes.bool,
    onRef: PropTypes.func,
    searchable: PropTypes.bool,
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
    this.onChange = this.onChange.bind(this);
    // this.getOptionsDelayed = debounce(this.getOptions.bind(this), 300);

    this.getOptions = this.getOptions.bind(this);
    // this.handleAjaxRequest = this.handleAjaxRequest.bind(this);
    this.handleAjaxRequestDelayed = debounce(this.handleAjaxRequest.bind(this), 300);
    axios.defaults.headers.common['X-CSRF-Token'] = ReactOnRails.authenticityToken();

  }

  // This stores a component reference so it can be used from the parent
  componentDidMount() {
    if (!this.props.soloMode) {
      this.props.onRef(this)
    }
  }

  // Same as above but destroys the reference instead
  componentWillUnmount() {
    if (!this.props.soloMode) {
      this.props.onRef(undefined)
    }
  }

  onChange (value) {
    this.setState({value: value});
    this.updateExternalDOM(value);
  }

  // This operates outside react and is used to store the value
  // at the true input field which is eventually used by the rails form
  setTextInputValue(value) {
    this.textInput.value = value;
  }

  // This is called from DependantSelect to clear the component's value
  clearSelection() {
    this.setState({selectedOption: ''});
  }

  handleAjaxRequest(query, callback) {
    axios.get(`/properties/locations.json?search=${query}`) // +1 because rails will_paginate starts from 1 while this starts from 0
      .then((response) => {
        console.log(response.data);
        callback(null, { options: response.data.locations.dataset });
        // return { options: response.data.locations.dataset}
      });
  }

  getOptions (input, callback) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }
    this.handleAjaxRequestDelayed(input, callback);
  }

  state = {
    selectedOption: '',
    value: ''
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
    if (!this.props.soloMode) {
      if (typeof this.props.handleOptions === "function") {
        this.props.handleOptions(selectedOption, this.props.controller);
      }
    }
  };

  render() {
    const {selectedOption} = this.state;
    const value = selectedOption && selectedOption.value;
    return (
      <div>
        <Async
          id={this.props.identity}
          inputProps={{'data-name': this.props.name}}
          name={this.props.name}
          className={this.props.className}
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

          value={this.state.value}
          onChange={this.onChange}

          // value="one"
          loadOptions={this.getOptions}
         />

        {/*<Select*/}
          {/*// id={this.props.identity}*/}
          {/*// inputProps={{'data-name': this.props.name}}*/}
          {/*// name={this.props.name}*/}
          {/*// value={value}*/}
          {/*// className={this.props.className}*/}
          {/*onChange={this.handleChange}*/}
          {/*options={this.props.options}*/}
          {/*placeholder={this.props.i18n.select.placeholder}*/}
          {/*disabled={this.props.disabled}*/}
          {/*searchable={this.props.searchable}*/}
        {/*/>*/}
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

