import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import spinner_URL from 'images/spinners/double_ring.svg';
import ReactPaginate from 'react-paginate';

export default class UsersList extends React.Component {
  // static propTypes = {
  //   name: PropTypes.string.isRequired, // this is passed from the Rails view
  // };

  /**
   * @param props - Comes from your rails view embedded in html thanks to react_on_rails.
   */
  constructor(props) {
    // console.log(props);
    // console.log(typeof(props.initial_payload.dataset_wrapper.dataset));
    // console.log(props.initial_payload.dataset_wrapper.dataset);
    super(props);

    this.state = { users: this.props.initial_payload.dataset_wrapper.dataset,
                   resultsPerPage: this.props.initial_payload.results_per_page,
                   isLoading: false,
                   pageCount: Math.ceil(this.props.initial_payload.total_entries / this.props.initial_payload.results_per_page),
                   selectedPage: this.getSelectedPage()
                  };


    // console.log('the page count is:', Math.ceixxl(this.props.initial_payload.total_entries / 10));
    // for (var i in this.state.users) {
    //   console.log(this.state.users[i]);
    // }
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

  advanceByTwo () {
    console.log('RUNNING');
  }

  handlePageClick = (pageNumber) => {
    console.log('selected page number is:', pageNumber);
    const selected = pageNumber.selected;
    history.pushState(null, null, `?page=${selected+1}`);
    this.setState({currentPage: selected, isLoading:true }, () => {
      axios.get(`/users.json?page=${selected +1}`) // +1 because rails will_paginate starts from 1 while this starts from 0
        .then(function (response) {
          console.log(response);
          let newData = response.data.userslist;
          this.setState({ users: newData.dataset,
                          pageCount: Math.ceil(response.data.total_entries / this.state.resultsPerPage),
                          isLoading: false,
                          selectedPage: selected
                        });
        }.bind(this))
        .catch(function (error) {
          console.log(error);
          this.setState({ isLoading: false });
        }.bind(this))
    });
  };


  render() {
    return (
      <div id="usersTableContainer">
        {this.state.isLoading
          ? <div className={'centered'}><img src={spinner_URL} /></div>
          : <div className={'tableContainer'}>
              <table id="usersTable" className="table table-striped pr-table">
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
                    <td><div className={'table-entry-image'}><img className="avatar-table-entry" src={user['avatar_url']}/><span>{user['name']}</span></div></td>
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
              <ReactPaginate previousLabel={"Previous"}
                             nextLabel={"Next"}
                             breakLabel={<a href="">...</a>}
                             breakClassName={"break-me"}
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
          <div onClick={(e)=>this.handlePageClick()} className={'btn btn-primary'}>Next page</div>
        </div>
      );
  }
}
