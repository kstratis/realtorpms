import PropTypes from 'prop-types';
import React from 'react';
// noinspection NpmUsedModulesInstalled
import spinner_URL from 'images/spinners/double_ring.svg';
import ReactPaginate from 'react-paginate';

const UsersList = ({isLoading, dataset, advanceByTwo, pageCount, handlePageClick, selectedPage}) => {

  return (
    <div className="dataTablePage">
      {isLoading
        ? <div className={'centered'}><img src={spinner_URL} /></div>
        : <div className={'dataTableContainer'}>
            <table id="usersTable" className="table table-striped pr-table dataTable">
              <thead>
                <tr>
                  <th><span>User</span></th>
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
      }
    </div>
  );
};

UsersList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  dataset: PropTypes.array.isRequired,
  advanceByTwo: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  handlePageClick: PropTypes.func.isRequired,
  selectedPage: PropTypes.number.isRequired
};

export default UsersList;


