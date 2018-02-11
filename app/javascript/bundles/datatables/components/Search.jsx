import PropTypes from 'prop-types';
import React from 'react';

const Search = ({searchInput, handleSearchInput, i18n}) => {

  return (
    <div className="col-md-6 col-md-offset-3">
      <div className="input-group user-search">
        <input type="text"
               className="form-control input-lg glowing-border"
               placeholder={i18n['users_search']['placeholder']}
               aria-describedby="basic-addon1"
               value={searchInput}
               onChange={handleSearchInput} />
        <span className="input-group-btn">
          <button className="btn btn-primary btn-custom" type="button">
            <i className="glyphicon glyphicon-search"> </i>
          </button>
        </span>
      </div>
    </div>
  );
};

Search.propTypes = {
  searchInput: PropTypes.string.isRequired,
  handleSearchInput: PropTypes.func.isRequired
};

export default Search;