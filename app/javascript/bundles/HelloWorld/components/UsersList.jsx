import PropTypes from 'prop-types';
import React from 'react';
// noinspection NpmUsedModulesInstalled;
// import spinner_URL from 'images/spinners/double_ring.svg';
import ReactPaginate from 'react-paginate';

const UsersList = ({isLoading, dataset, advanceByTwo, pageCount, handlePageClick, selectedPage, handleSort, sortedBy, sortedDirection}) => {

  return (

    <div className="dataTablePage">
      {isLoading
        ? <div className={'centered'}><div className={'spinner'} /></div>
        // ? <div className={'centered'}><img src={spinner_URL} /></div>
        : dataset.length > 0
          ? <div className={'dataTableContainer'}>
              <table id="usersTable" className="table table-striped pr-table dataTable">
                <thead>
                  <tr>
                    <th>
                      <a className={'sortable-header-name'} href={''} onClick={(e) => handleSort(e, 'last_name')}>
                        <span>User</span>
                        {sortedBy === 'last_name'
                          ? sortedDirection === 'asc'
                            ? <span className={'sortable-icon-container'}>
                                <i title='Ascending order' className="fa fa-chevron-circle-up fa-lg fa-fw pull-right" aria-hidden="true"> </i>
                              </span>
                            : <span className={'sortable-icon-container'}>
                                <i title='Descending order' className="fa fa-chevron-circle-down fa-lg fa-fw pull-right" aria-hidden="true"> </i>
                              </span>
                          : ''
                        }
                      </a>
                    </th>
                    <th><span>Email</span></th>
                    <th><span>User Type</span></th>
                    <th><span>Registration</span></th>
                    <th><span>Operations</span></th>
                  </tr>
                </thead>
                <tbody>
                {dataset.map((entry) => (
                  <tr key={entry.id}>
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
                                     onClick={advanceByTwo}>...</span>}
                             breakClassName={"break-button"}
                             pageCount={pageCount}
                             marginPagesDisplayed={2}
                             pageRangeDisplayed={5}
                             onPageChange={handlePageClick}
                             containerClassName={"pagination"}
                             subContainerClassName={"pages pagination"}
                             activeClassName={"active"}
                             forcePage={selectedPage}
                             pageClassName={"page"}
                             nextClassName={'next'}
                             previousClassName={'previous'} />
            </div>
        : <div className={"no-users"}>
            <i className="pr-icon lg no-results"> </i>
            <h3>No users found.</h3>
          </div>
      }
    </div>
  );
};

UsersList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  dataset: PropTypes.array.isRequired,
  advanceByTwo: PropTypes.func.isRequired,
  handleSort: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  handlePageClick: PropTypes.func.isRequired,
  selectedPage: PropTypes.number.isRequired,
  sortedBy: PropTypes.string.isRequired,
  sortedDirection: PropTypes.string.isRequired
};

export default UsersList;


