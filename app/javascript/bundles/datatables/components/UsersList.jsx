import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';


// import { addLocaleData } from 'react-intl';
// import en from 'react-intl/locale-data/en';
// import { defaultMessages } from './../../../locales/default';
// import { IntlProvider, injectIntl, intlShape } from 'react-intl';
// import {formatMessage} from "react-intl/src/format";

// import { formatMessage } from 'react-intl';

// addLocaleData([...en, ...gr]);

// const locale =  defaultLocale;
// const messages = translations[locale];

const UsersList = ({handlePageClick, handleSort, handleAssign, advanceByTwo, isLoading, dataset, pageCount, selectedPage, sorting, ordering, i18n}) => {
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
                  <a id='sort_by_name' className={'sortable-header-name'} href={''} onClick={(e) => handleSort(e, 'last_name')}>
                    <span>{i18n['users_datatable']['partner']}</span>
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
                  <a id='sort_by_email' className={'sortable-header-name'} href={''} onClick={(e) => handleSort(e, 'email')}>
                    <span>{i18n['users_datatable']['email']}</span>
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
                <th><span>{i18n['users_datatable']['usertype']}</span></th>
                <th>
                  <a id='sort_by_date' className={'sortable-header-name'} href={''} onClick={(e) => handleSort(e, 'created_at')}>
                    <span>{i18n['users_datatable']['registration']}</span>
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
                <th><span>{i18n['users_datatable']['actions']}</span></th>
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
                      <span>{entry['type'] ? i18n['users_datatable']['admin'] : i18n['users_datatable']['user'] }</span>
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
                        <div className="btn-group">

                          <div className="btn-group" role="group" aria-label="...">
                            <a title="View Profile" className="btn btn-default" href={entry['view_entity_path']}>
                              <i className="pr-icon action-button-graphic xs bar-chart"> </i>
                            </a>
                          </div>

                          <div className="btn-group" role="group" aria-label="...">
                            <a title="Edit User" className="btn btn-default" href={entry['edit_entity_path']}>
                              <i className="pr-icon action-button-graphic xs pencil"> </i>
                            </a>
                          </div>

                          <div className="btn-group" role="group" aria-label="...">
                            <a title="Delete User"
                               className="btn btn-default"
                               href={entry['view_entity_path']}
                               data-method="delete"
                               data-confirm="Are you sure?"
                               rel="nofollow">
                              <i className="pr-icon action-button-graphic xs user-delete"> </i>
                            </a>
                          </div>
                        </div>
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
  sorting: PropTypes.string.isRequired,
  ordering: PropTypes.string.isRequired
};

const UsersListWithDatatable = withDatatable(UsersList);

export default UsersListWithDatatable;


