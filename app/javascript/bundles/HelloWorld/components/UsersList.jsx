import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import spinner_URL from 'images/spinners/double_ring.svg';
import ReactPaginate from 'react-paginate';
// import ReactUltimatePagination from 'react-ultimate-pagination';
// import UltimatePagination from 'reactUltimatePaginationBootstrap3';

export default class UsersList extends React.Component {
  // static propTypes = {
  //   name: PropTypes.string.isRequired, // this is passed from the Rails view
  // };

  /**
   * @param props - Comes from your rails view embedded in html thanks to react_on_rails.
   */
  constructor(props) {
    super(props);
    this.state = { users: this.props.initial_payload.dataset_wrapper.dataset,
                   resultsPerPage: this.props.initial_payload.results_per_page,
                   isLoading: false,
                   pageCount: Math.ceil(this.props.initial_payload.total_entries / this.props.initial_payload.results_per_page),
                   selectedPage: this.getSelectedPage()
                  };
    this.breakButtons = [];
    // bind always returns a new function. This new function is important because without a reference to it
    // we won't be able to remove it as a listener in componentWillUnmount leading us to memory leaks.
    // https://gist.github.com/Restuta/e400a555ba24daa396cc
    this.bound_onHistoryButton = this.handleHistoryButton.bind(this);
    this.determineDirection = this.determineDirection.bind(this);
  }

  componentDidMount() {
    window.addEventListener("popstate", this.bound_onHistoryButton);
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.bound_onHistoryButton);
  }

  // Turbolinks also have some sort of history state management. We don't want React to get in its way.
  // This function will only be used when turbolinks are not in use. That is all ajax requests.
  // If the 'turbolinks' key appears anywhere in history.state that means we need to bailout and let
  // turbolinks handle the re-rendering.
  handleHistoryButton(e) {
    const backPage = this.getSelectedPage();
    if (!('turbolinks' in e.state)){
      this.handlePageClick(backPage, true, true);
    }
  }

  // We want this to be reflected in the React component. That's why we subtract 1
  getSelectedPage () {
    const url = new URL(window.location.href);
    const selectedPage = url.searchParams.get('page') || 1;
    return (parseInt(selectedPage)-1);
  };

  updateName = (name) => {
    this.setState({ name });
  };

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

  handlePageClick = (pageNumber, pageNo=false, backButtonInvoked=false) => {
    const selected = pageNo ? pageNumber : pageNumber.selected;
    // console.log('selected page number is:', selected + 1);
    if (!backButtonInvoked) history.pushState({jsonpage: selected+1}, null, `?page=${selected+1}`);
    this.setState({currentPage: selected, isLoading:true }, () => {
      axios.get(`/users.json?page=${selected +1}`) // +1 because rails will_paginate starts from 1 while this starts from 0
        .then(function (response) {
          // console.log(response);
          let newData = response.data.userslist;
          this.setState({ users: newData.dataset,
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


  render() {
    return (
      <div className="dataTablePage">
        {this.state.isLoading
          ? <div className={'centered'}><img src={spinner_URL} /></div>
          : <div className={'dataTableContainer'}>
              <table id="usersTable" className="table table-striped pr-table dataTable">
                <thead>
                  <tr>
                    <th><span>User</span></th>
                    <th><span>Email</span></th>
                    <th><span>User type</span></th>
                    <th><span>Registration</span></th>
                    <th><span>Operations</span></th>
                  </tr>
                </thead>
                <tbody>
                {this.state.users.map((user) => (
                  <tr key={user.id}>
                    {/*<td><div className={'table-entry-image'}><img className="avatar-table-entry" src={user['avatar_url']}/><span>{user['name']}</span></div></td>*/}
                    <td><div className={'table-entry'}><img className="avatar-table-entry" src={user['avatar_url']}/><span>{user['name']}</span></div></td>
                    <td><div className={'table-entry'}><span>{user['email']}</span></div></td>
                    <td><div className={'table-entry'}><span>{user['type']}</span></div></td>
                    <td><div className={'table-entry'}><span>{user['registration']}</span></div></td>
                    <td>
                      <div className="action-buttons-container table-entry">
                        <a title="Edit user" className="table-icon-entry" href=""><i className="fa fa-pencil fa-fw fa-lg"> </i></a>
                        <a title="Deactivate user" className="table-icon-entry" href=""><i className="fa fa-power-off fa-fw fa-lg"> </i></a>
                        <a title="Delete user user" className="table-icon-entry" href=""><i className="fa fa-trash fa-fw fa-lg"> </i></a>
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
              <ReactPaginate previousLabel={"❮"}
                             nextLabel={"❯"}
                             breakLabel={
                               <span className="break-button-content"
                                     onClick={this.advanceByTwo.bind(this)}>...</span>}
                             breakClassName={"break-button"}
                             pageCount={this.state.pageCount}
                             marginPagesDisplayed={2}
                             pageRangeDisplayed={5}
                             onPageChange={this.handlePageClick}
                             containerClassName={"pagination"}
                             subContainerClassName={"pages pagination"}
                             activeClassName={"active"}
                             forcePage={this.state.selectedPage}
                             pageClassName={"page"}
                             nextClassName={'next'}
                             previousClassName={'previous'}/>
            </div>
          }
        </div>
      );
  }
}
