import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';

const UsersListAssignable = ({handlePageClick, handleSort, handleAssign, advanceByTwo, isLoading, dataset, pageCount, selectedPage, sorting, ordering}) => {
  return (
    <div className="dataTablePage col-md-12">
      {isLoading
        ? <div className={'centered'}>
          <div className={'spinner'} />
        </div>
        : dataset.length > 0
          ? <div className={'dataTableContainer'}>
            <table id="usersTable" className="table table-striped pr-table dataTable">
              <thead>
              <tr>
                <th>
                  <a className={'sortable-header-name'} href={''} onClick={(e) => handleSort(e, 'last_name')}>
                    <span>User</span>
                    {sorting === 'last_name'
                      ? ordering === 'asc'
                        ? <span className={'sortable-icon-container'}>
                                <i title='Ascending order' className="fa fa-chevron-up fa-lg fa-fw pull-right"
                                   aria-hidden="true"> </i>
                              </span>
                        : <span className={'sortable-icon-container'}>
                                <i title='Descending order' className="fa fa-chevron-down fa-lg fa-fw pull-right"
                                   aria-hidden="true"> </i>
                              </span>
                      : ''
                    }
                  </a>
                </th>
                <th>
                  <a className={'sortable-header-name'} href={''} onClick={(e) => handleSort(e, 'email')}>
                    <span>Email</span>
                    {sorting === 'email'
                      ? ordering === 'asc'
                        ? <span className={'sortable-icon-container'}>
                                <i title='Ascending order' className="fa fa-chevron-circle-up fa-lg fa-fw pull-right"
                                   aria-hidden="true"> </i>
                              </span>
                        : <span className={'sortable-icon-container'}>
                                <i title='Descending order' className="fa fa-chevron-circle-down fa-lg fa-fw pull-right"
                                   aria-hidden="true"> </i>
                              </span>
                      : ''
                    }
                  </a>
                </th>
                <th><span>User Type</span></th>
                <th>
                  <a className={'sortable-header-name'} href={''} onClick={(e) => handleSort(e, 'created_at')}>
                    <span>Registration</span>
                    {sorting === 'created_at'
                      ? ordering === 'asc'
                        ? <span className={'sortable-icon-container'}>
                                <i title='Ascending order' className="fa fa-chevron-circle-up fa-lg fa-fw pull-right"
                                   aria-hidden="true"> </i>
                              </span>
                        : <span className={'sortable-icon-container'}>
                                <i title='Descending order' className="fa fa-chevron-circle-down fa-lg fa-fw pull-right"
                                   aria-hidden="true"> </i>
                              </span>
                      : ''
                    }
                  </a>
                </th>
                <th><span>Quick Actions</span></th>
              </tr>
              </thead>
              <tbody>
              {dataset.map((entry) => (
                <tr key={entry['id']}>
                  <td>
                    <div className={'table-entry'}><img className="avatar-table-entry" src={entry['avatar_url']}/>
                      <span><a className={'user-entry-color'} href={entry['view_entity_path']}>{entry['name']}</a></span>
                    </div>
                  </td>
                  <td>
                    <div className={'table-entry'}>
                      <span>{entry['email']}</span>
                    </div>
                  </td>

                  <td>
                    <div className={'table-entry'}>
                      <span>{entry['type']}</span>
                    </div>
                  </td>

                  <td>
                    <div className={'table-entry'}>
                      <span>{entry['registration']}</span>
                    </div>
                  </td>

                  <td>
                    <div className="action-buttons-container table-entry">
                      <div className="btn-group min-width" role="group" aria-label="...">
                        <a onClick={handleAssign}
                           data-uid={entry['id']}
                           title='View Profile'
                           className='btn btn-default ef-btn'
                           href={entry['view_entity_path']}>
                          {
                            entry['is_assigned']
                              ? 'UNASSIGN'
                              : 'ASSIGN'
                          }
                        </a>
                      </div>
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
                           previousClassName={'previous'}/>
          </div>
          : <div className={"no-users"}>
            <i className="pr-icon lg no-results"> </i>
            <h3>No users available.</h3>
          </div>
      }
    </div>
  );
};

UsersListAssignable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  dataset: PropTypes.array.isRequired,
  advanceByTwo: PropTypes.func.isRequired,
  handleSort: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  handlePageClick: PropTypes.func.isRequired,
  selectedPage: PropTypes.number.isRequired,
  sorting: PropTypes.string.isRequired,
  ordering: PropTypes.string.isRequired
};

const UsersListAssignableWithDatatable = withDatatable(UsersListAssignable);

export default UsersListAssignableWithDatatable;


