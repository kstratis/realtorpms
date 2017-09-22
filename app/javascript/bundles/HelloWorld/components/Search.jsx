import PropTypes from 'prop-types';
import React from 'react';

const Search = ({searchInput, handleSearchInput}) => {

  // filterData (keyword) {
  //   axios.get(`/users.json?search=${keyword}`) // +1 because rails will_paginate starts from 1 while this starts from 0
  //     .then(function (response) {
  //       console.log(response);
  //       // let newData = response.data.userslist;
  //       // this.setState({ users: newData.dataset,
  //       //   pageCount: Math.ceil(response.data.total_entries / this.state.resultsPerPage),
  //       //   isLoading: false,
  //       //   selectedPage: selected
  //       // });
  //     }.bind(this))
  //     .catch(function (error) {
  //       console.warn(error);
  //       // this.setState({ isLoading: false });
  //     }.bind(this))
  // }


  return (
    <div className="col-md-6 col-md-offset-3">
      <div className="input-group user-search">
        <input type="text"
               className="form-control input-lg glowing-border"
               placeholder="π.χ. Γιώργος Παπαδόπουλος"
               aria-describedby="basic-addon1"
               value={searchInput}
               onChange={handleSearchInput} />
        <span className="input-group-btn">
          <button className="btn btn-primary btn-custom" type="button">
            <i className="glyphicon glyphicon-search"></i>
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