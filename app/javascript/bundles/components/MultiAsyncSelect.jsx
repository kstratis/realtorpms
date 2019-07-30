import React from 'react';
import makeAnimated from 'react-select/animated';
import { debounce, renderHTML } from '../utilities/helpers';
import AsyncSelect from 'react-select/async';
import { reactSelectStyles } from '../styles/componentStyles';
import PropTypes from 'prop-types';
import axios from 'axios';
const animatedComponents = makeAnimated();

class MultiAsyncSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handleAjaxRequestDelayed = debounce(this.handleAjaxRequest.bind(this), 300);
    this.loadAsyncOptions = this.loadAsyncOptions.bind(this);
    this.promiseOptions = this.promiseOptions.bind(this);
    this.state = {
      selectedOption: this.props.storedOption || '',
      isOpen: false,
      request: {},
      assignmentRequest: {}
    };
  }

  onMenuOpen = () => this.setState({ isOpen: true });
  onMenuClose = () => this.setState({ isOpen: false });

  handleAjaxRequest(request, callback) {
    axios({
      method: request.method,
      url: request.url,
      data: request.payload
    }).then((result)=> {
      callback(result.data.message);
    });
  }

  loadAsyncOptions(query, callback) {
    if (!query) {
      return Promise.resolve({ options: [] });
    }
    this.handleAjaxRequestDelayed({
      url: `${this.props.collection_endpoint}.json?search=${query}&dropdown=1`,
      method: 'get',
      payload: {}
    }, callback);
  }

  promiseOptions(inputValue){
    console.log('yolo');

  }

  render() {
    {console.log('rendering')}
    return (
    <>
      <AsyncSelect
        styles={reactSelectStyles}
        // onChange={handleChange}
        // value={data}
        components={animatedComponents}
        autoload={false}
        cache={false}
        menuIsOpen={this.state.isOpen}
        isMulti={true}
        backspaceRemovesValue={false}
        placeholder={this.props.i18n.select.placeholder}
        noOptionsMessage={() => renderHTML(this.props.i18n.select.noresults)}
        loadingMessage={() => renderHTML(this.props.i18n.select.loading)}
        loadOptions={this.promiseOptions}
        onMenuOpen={this.onMenuOpen}
        onMenuClose={this.onMenuClose}
      />
      {this.props.hasFeedback ? <small className="form-text text-muted">{this.props.i18n.select.feedback}</small> : ''}
    </>)
  }
}

MultiAsyncSelect.propTypes = {
  collection_endpoint: PropTypes.string.isRequired,
  storedOptions: PropTypes.array,
  i18n: PropTypes.shape({
    select: PropTypes.shape({
      placeholder: PropTypes.string.isRequired,
      noresults: PropTypes.string.isRequired,
      loading: PropTypes.string.isRequired,
      feedback: PropTypes.string.isRequired
    })
  }).isRequired
};

export default MultiAsyncSelect;
















