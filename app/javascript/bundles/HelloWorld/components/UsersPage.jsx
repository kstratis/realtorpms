import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import spinner_URL from 'images/spinners/double_ring.svg';
import ReactPaginate from 'react-paginate';
// import ReactUltimatePagination from 'react-ultimate-pagination';
// import UltimatePagination from 'reactUltimatePaginationBootstrap3';

export default class UsersPage extends React.Component {
  // static propTypes = {
  //   name: PropTypes.string.isRequired, // this is passed from the Rails view
  // };

  /**
   * @param props - Comes from your rails view embedded in html thanks to react_on_rails.
   */
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    // this.breakButtons = [];
    // bind always returns a new function. This new function is important because without a reference to it
    // we won't be able to remove it as a listener in componentWillUnmount leading us to memory leaks.
    // https://gist.github.com/Restuta/e400a555ba24daa396cc
    // this.bound_onHistoryButton = this.handleHistoryButton.bind(this);
    // this.det/ermineDirection = this.determineDirection.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    // this.filterData(event.target.value);
    // let existingParams = window.location.search;
    // history.replaceState(null, '', `${existingParams}&search=${event.target.value}`);
  }

  filterData (keyword) {
    axios.get(`/users.json?search=${keyword}`) // +1 because rails will_paginate starts from 1 while this starts from 0
      .then(function (response) {
        console.log(response);
        // let newData = response.data.userslist;
        // this.setState({ users: newData.dataset,
        //   pageCount: Math.ceil(response.data.total_entries / this.state.resultsPerPage),
        //   isLoading: false,
        //   selectedPage: selected
        // });
      }.bind(this))
      .catch(function (error) {
        console.warn(error);
        // this.setState({ isLoading: false });
      }.bind(this))
  }

  render() {
    return (
      <div className="col-md-6 col-md-offset-3">
        <div className="input-group user-search">
          <input type="text" className="form-control input-lg glowing-border" placeholder="π.χ. Γιώργος Παπαδόπουλος" aria-describedby="basic-addon1" value={this.state.value} onChange={this.handleChange} />
          <span className="input-group-btn">
            <button className="btn btn-primary btn-custom" type="button">
                <i className="glyphicon glyphicon-search"></i>
            </button>
          </span>
        </div>
      </div>

    );
  }
}
