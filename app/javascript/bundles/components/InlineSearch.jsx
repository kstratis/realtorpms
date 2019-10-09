import PropTypes from 'prop-types';
import React from 'react';
import { debounce } from '../utilities/helpers';
import axios from 'axios';

class InlineSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inlineSearchInput: '',
      results: [],
      isLoading: false
    };
    this.handleInlineSearchInput = this.handleInlineSearchInput.bind(this);
    this.handleAjaxRequestDelayed = debounce(this.handleAjaxRequest, 300);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.searchInput = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target) && this.state.inlineSearchInput) {
      this.setState({ inlineSearchInput: '' });
    }
  }

  handleAjaxRequest(query = '') {
    if (!query) return;
    axios
      .get(`${this.props.path}?search=${query}`)
      .then(
        function(response) {
          this.setState({
            results: response.data.message,
            isLoading: false
          });
        }.bind(this)
      )
      .catch(
        function(error) {
          console.warn(error);
          this.setState({ isLoading: false });
        }.bind(this)
      );
  }

  handleInlineSearchInput(e) {
    e.preventDefault();
    this.setState(
      {
        inlineSearchInput: e.target.value
      },
      () => {
        this.setState({ isLoading: true });
        this.handleAjaxRequestDelayed(this.state.inlineSearchInput);
      }
    );
  }

  render() {
    return (
      <div ref={this.setWrapperRef} className="input-group">
      {/*<div ref={this.setWrapperRef} className="input-group input-group-search">*/}
        <label className="input-group-prepend" htmlFor="search">
            <span className="input-group-text">
              <span className="oi oi-magnifying-glass" />
            </span>
        </label>
        <input
          ref={this.searchInput}
          type="text"
          className="form-control"
          aria-describedby="Inline Search"
          aria-label="Inline Search"
          value={this.state.inlineSearchInput}
          onChange={this.handleInlineSearchInput}
          placeholder={this.props.i18n.search}
        />
        <div
          className={`tt-menu ${this.state.inlineSearchInput ? 'tt-open' : ''}`}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 100,
            display: `${this.state.inlineSearchInput ? 'block' : 'none'}`
          }}>
          <div className="tt-dataset tt-dataset-states">
            {this.state.isLoading ? (
              <div className="tt-suggestion tt-selectable">{this.props.i18n.loading}</div>
            ) : this.state.results.length > 0 ? (
              <>
                {this.state.results.map(entry => (
                  <a key={entry.value} href={`/properties/${entry.value}`} className="tt-suggestion tt-selectable">
                    <strong>{entry.label.toUpperCase()}</strong>
                  </a>
                ))}
              </>
            ) : (
              <div className="tt-suggestion tt-selectable">{this.props.i18n.noresults}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default InlineSearch;
