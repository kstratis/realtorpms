import PropTypes from 'prop-types';
import React from 'react';

const Search = ({searchInput, handleSearchInput, i18n}) => {

  return (
    <div className="col-md-6 col-md-offset-3">
      <div className="user-search">
        <input type="text"
               className="input-lg glowing-border"
               placeholder={i18n['search']['placeholder']}
               aria-describedby="basic-addon1"
               value={searchInput}
               onChange={handleSearchInput} />
      </div>
    </div>
  );
};

Search.propTypes = {
  searchInput: PropTypes.string.isRequired,
  handleSearchInput: PropTypes.func.isRequired
};

export default Search;