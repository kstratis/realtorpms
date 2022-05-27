import PropTypes from 'prop-types';
import React from 'react';

const Search = ({ searchInput, handleSearchInput, placeholder }) => {
  return (
    <div className="search-container">
      <div className="justify-content-center flex-fill search-height">
        <div className="input-group has-clearable">
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={e => {
              handleSearchInput(e);
            }}>
            <span aria-hidden="true">
              <i className="fas fa-times-circle" />
            </span>
          </button>
          <label className="input-group-prepend" htmlFor="search">
            <span className="input-group-text">
              <span className="fas fa-search" />
            </span>
          </label>
          <input
            id={'search'}
            type="text"
            className="form-control"
            placeholder={placeholder}
            aria-describedby="Search"
            aria-label="Search"
            value={searchInput}
            onChange={handleSearchInput}
          />
        </div>
      </div>
    </div>
  );
};

Search.propTypes = {
  searchInput: PropTypes.string.isRequired,
  handleSearchInput: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired
};

export default Search;
