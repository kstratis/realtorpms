import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import makeAnimated from 'react-select/animated';
import AsyncSelect from 'react-select/async';
import ReactOnRails from 'react-on-rails';
import { debounce, renderHTML } from '../utilities/helpers';

const animatedComponents = makeAnimated();

const selectStyles = {
  container: (base, state) => {
    return { ...base };
  },
  option: (base, state) => ({
    ...base,
    '&:hover': {
      cursor: 'pointer'
    }
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    '&:hover': {
      cursor: 'pointer'
    },
    transform: `${state.selectProps.menuIsOpen && 'rotate(180deg)'}`
  }),
  clearIndicator: (base, state) => ({
    ...base,
    '&:hover': {
      cursor: 'pointer'
    }
  }),
  input: (base, state) => ({
    ...base
    // flexBasis: '33.33%'
    // backgroundColor: 'red'
  }),
  singleValue: (base, state) => ({
    ...base,
    fontWeight: 700,
    backgroundColor: '#216AB0',
    color: '#FFFFFF',
    padding: '10px'
  })
};

const colourOptions = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' }
];

const filterColors = inputValue => {
  let res = colourOptions.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));
  return res;
};

const promiseOptions = inputValue =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(filterColors(inputValue));
    }, 1000);
  });

class MultiAsyncSelect extends React.Component {
  static propTypes = {
    identity: PropTypes.string,
    retrieve_endpoint: PropTypes.string,
    assign_endpoint: PropTypes.string,
    validatorGroup: PropTypes.string,
    options: PropTypes.array,
    handleOptions: PropTypes.func,
    isDisabled: PropTypes.bool,
    searchable: PropTypes.bool,
    storedOptions: PropTypes.any,
    // soloMode guards against dynamically setting the dropdown options
    // and gettings a ref which is needed in DependantSelect
    i18n: PropTypes.shape({
      select: PropTypes.object,
      validatorErrMsg: PropTypes.string
    })
  };

  constructor(props) {
    super(props);
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAjaxRequestDelayed = debounce(this.handleAjaxRequest.bind(this), 300);
    axios.defaults.headers.common['X-CSRF-Token'] = ReactOnRails.authenticityToken();
  }

  state = {
    selectedOptions: this.props.storedOptions || '',
    inputValue: '',
    isOpen: false
  };

  onMenuOpen = () => this.setState({ isOpen: true });
  onMenuClose = () => this.setState({ isOpen: false });

  handleAjaxRequest(query, callback) {
    axios
      .get(`${this.props.collection_endpoint}.json?search=${query}&dropdown=1`) // +1 because rails will_paginate starts from 1 while this starts from 0
      .then(response => {
        // DEBUG
        // console.log(response.data.data.dataset);

        // +callback+ is react-select native function which is used to build the dropdown options. It is passed to
        // our registered function (handleAjaxRequest here) so that we can manipulate it and call it whenever we see fit
        callback(response.data.data.dataset);
      });
  }

  getOptions(input, callback) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }
    this.handleAjaxRequestDelayed(input, callback);
  }

  // This is called on every value change to update the current value and the "true" hidden input field.
  // If it is the parent dropdown that is change it will also call the handleOptions from DependantSelect
  // to update the childen's dropdown values accordingly
  handleChange(selectedOptions) {
    console.log(selectedOptions);
    this.setState({ selectedOptions });
    console.log('changed');
    axios({
      method: 'post',
      url: this.props.assign_endpoint,
      data: { selection: selectedOptions || [] }
    }).then(() => {
      console.log('OK');
    });
  }

  render() {
    // This is needed for the menu open/close styles
    const { isOpen } = this.state;
    return (
      <>
        <AsyncSelect
          styles={selectStyles}
          onChange={this.handleChange}
          value={this.state.selectedOptions}
          components={animatedComponents}
          autoload={false}
          cache={false}
          menuIsOpen={isOpen}
          isMulti={true}
          backspaceRemovesValue={false}
          placeholder={this.props.i18n.select.placeholder_users}
          noOptionsMessage={() => renderHTML(this.props.i18n.select.nooptions_async_html)}
          loadingMessage={() => renderHTML(this.props.i18n.select.loading_html)}
          loadOptions={this.getOptions}
          onMenuOpen={this.onMenuOpen}
          onMenuClose={this.onMenuClose}
        />
        <small className="form-text text-muted">{this.props.feedback}</small>
        <div className="invalid-feedback" />
      </>
    );
  }
}

export default MultiAsyncSelect;
