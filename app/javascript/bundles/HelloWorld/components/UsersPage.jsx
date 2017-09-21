import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import UsersList from "./UsersList";
import Search from "./Search";

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
      dataset: this.props.initial_payload.dataset_wrapper.dataset,
      resultsPerPage: this.props.initial_payload.results_per_page,
      isLoading: false,
      pageCount: Math.ceil(this.props.initial_payload.total_entries / this.props.initial_payload.results_per_page),
      /* This is required only in initial loading.
       * We want this to be reflected in our React component. That's why we subtract 1 */
      selectedPage: this.getSelectedPage()
    };

    // bind always returns a new function. This new function is important because without a reference to it
    // we won't be able to remove it as a listener in componentWillUnmount leading us to memory leaks.
    // https://gist.github.com/Restuta/e400a555ba24daa396cc
    this.bound_onHistoryButton = this.handleHistoryButton.bind(this);
    this.breakButtons = [];
    this.handlePageClick = this.handlePageClick.bind(this);
    this.determineDirection = this.determineDirection.bind(this);
  }

  getSelectedPage () {
    const selectedPage = new URL(window.location.href).searchParams.get('page') || 1;
    return (parseInt(selectedPage)-1);
  };

  componentDidMount() {
    window.addEventListener("popstate", this.bound_onHistoryButton);
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.bound_onHistoryButton);
  }

  handlePageClick (pageNumber, pageNo=false, backButtonInvoked=false)  {
    const selected = pageNo ? pageNumber : pageNumber.selected;
    if (!backButtonInvoked) history.pushState({jsonpage: selected+1}, null, `?page=${selected+1}`);
    this.setState({currentPage: selected, isLoading:true }, () => {
      axios.get(`/users.json?page=${selected +1}`) // +1 because rails will_paginate starts from 1 while this starts from 0
        .then(function (response) {
          // console.log(response);
          let newData = response.data.userslist;
          this.setState({ dataset: newData.dataset,
            pageCount: Math.ceil(response.data.total_entries / this.state.resultsPerPage),
            isLoading: false,
            selectedPage: selected
          });
        }.bind(this))
        .catch(function (error) {
          console.warn(error);
          this.setState({ isLoading: false });
        }.bind(this))
    });
  };

  // Turbolinks also have some sort of history state management. We don't want React to get in its way.
  // This function will only be used when turbolinks are not in use. That is all ajax requests.
  // If the 'turbolinks' key appears anywhere in history.state that means we need to bailout and let
  // turbolinks handle the re-rendering.
  handleHistoryButton(e) {
    const historyPage = this.getSelectedPage();
    if (!('turbolinks' in e.state)){
      this.handlePageClick(historyPage, true, true);
    }
  }

  determineDirection (element) {
    let ellipsisDomElement = $(element).parent();
    let direction = '+';
    ellipsisDomElement.nextAll().each((i, element)=>{
      if ($(element).hasClass('active')){
        direction = '-';
        return false;
      }
    });
    return direction;
  };

  advanceByTwo (e) {
    const sign = this.determineDirection(e.target);
    if (sign === '+') {
      this.handlePageClick(this.state.selectedPage + 2, true);
    } else{
      this.handlePageClick(this.state.selectedPage - 2, true);
    }
  }


  render() {
    return (
      <div>
        <Search />
        <div className="col-md-12">
          <UsersList
            dataset={this.state.dataset}
            resultsPerPage={this.state.resultsPerPage}
            isLoading={this.state.isLoading}
            selectedPage={this.state.selectedPage}
            pageCount={this.state.pageCount}
            handlePageClick={this.handlePageClick}
            advanceByTwo={(e) => this.advanceByTwo(e)}/>
        </div>
      </div>
    );
  }
}
