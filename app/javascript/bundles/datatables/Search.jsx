import PropTypes from 'prop-types';
import React from 'react';

const Search = ({ searchInput, handleSearchInput, showFilterType, i18n }) => {
  return (
    <div className="col col-md-5 offset-md-1">
      <div className="user-search justify-content-center flex-fill">
        <input
          type="search"
          className="form-control"
          placeholder={i18n['search']['placeholder']}
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
  i18n: PropTypes.object.isRequired
};

export default Search;
