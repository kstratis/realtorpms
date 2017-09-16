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
   * @param props - Comes from your rails view.
   */
  constructor(props) {
    console.log(props);
    super(props);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    this.state = { users: this.props.users,
                   isLoading: false};

    // for (var i in this.state.users) {
    //   console.log(this.state.users[i]);
    // }
  }

  updateName = (name) => {
    this.setState({ name });
  };

  handlePageClick = (pageNumber) => {
    console.log(pageNumber.selected);
    this.setState({ isLoading: true });
    axios.get(`/users.json?page=${pageNumber.selected}`)
      .then(function (response) {
        // console.log(response);
        this.setState({ users: response.data.users, isLoading: false });
      }.bind(this))
      .catch(function (error) {
        console.log(error);
        this.setState({ isLoading: false });
      }.bind(this))

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
                           activeClassName={"active"} />


          </div>
        }
        <div onClick={(e)=>this.handlePageClick()} className={'btn btn-primary'}>Next page</div>

          </div>
      );
  }
}
