import PropTypes from 'prop-types';
import React from 'react';

const Search = ({ searchInput, handleSearchInput, placeholder }) => {
  return (
    <div className="col col-md-6 col-xs-12 col-sm-12 search-container">
      <div className="justify-content-center flex-fill">
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
              <span className="oi oi-magnifying-glass" />
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
