import PropTypes from 'prop-types';
import React from 'react';
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
    // this.state = { dataset: this.props.initial_payload.dataset_wrapper.dataset,
    //                resultsPerPage: this.props.initial_payload.results_per_page,
    //                isLoading: false,
    //                pageCount: Math.ceil(this.props.initial_payload.total_entries / this.props.initial_payload.results_per_page),
    //                selectedPage: this.getSelectedPage()
    //               };

  }

  render() {
    return (
      <div className="dataTablePage">
        {this.props.isLoading
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
                {this.props.dataset.map((entry) => (
                  <tr key={entry.id}>
                    {/*<td><div className={'table-entry-image'}><img className="avatar-table-entry" src={entry['avatar_url']}/><span>{entry['name']}</span></div></td>*/}
                    <td><div className={'table-entry'}><img className="avatar-table-entry" src={entry['avatar_url']}/><span>{entry['name']}</span></div></td>
                    <td><div className={'table-entry'}><span>{entry['email']}</span></div></td>
                    <td><div className={'table-entry'}><span>{entry['type']}</span></div></td>
                    <td><div className={'table-entry'}><span>{entry['registration']}</span></div></td>
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
                                     onClick={this.props.advanceByTwo}>...</span>}
                             breakClassName={"break-button"}
                             pageCount={this.props.pageCount}
                             marginPagesDisplayed={2}
                             pageRangeDisplayed={5}
                             onPageChange={this.props.handlePageClick}
                             containerClassName={"pagination"}
                             subContainerClassName={"pages pagination"}
                             activeClassName={"active"}
                             forcePage={this.props.selectedPage}
                             pageClassName={"page"}
                             nextClassName={'next'}
                             previousClassName={'previous'}/>
            </div>
          }
        </div>
      );
  }
}
