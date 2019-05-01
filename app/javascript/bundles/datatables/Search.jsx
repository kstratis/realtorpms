import PropTypes from 'prop-types';
import React from 'react';

const Search = ({ searchInput, handleSearchInput, placeholder }) => {
  return (
    <div className="col col-md-6">
      <div className="user-search justify-content-center flex-fill">
        <input
          type="search"
          className="form-control"
          placeholder={placeholder}
          aria-describedby="Client search"
          aria-label="Client search"
          value={searchInput}
          onChange={handleSearchInput}
        />
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
