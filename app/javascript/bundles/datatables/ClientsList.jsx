import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';
import Search from './Search';
import Spinner from './Spinner';
import Avatar from '../components/Avatar';
import { capitalizeFirstLetter } from '../utilities/helpers';

const ClientsList = ({
  handlePageClick,
  handleSort,
  advanceByTwo,
  isLoading,
  dataset,
  pageCount,
  selectedPage,
  sorting,
  ordering,
  count,
  i18n,
  meta,
  handleSearchInput,
  searchInput
}) => {
  return (
    <div className="users-list">
      <Spinner isLoading={isLoading} />
      <div className={'container'}>
        <div className={'row'}>
          <Search handleSearchInput={handleSearchInput} searchInput={searchInput} placeholder={i18n['search']} />
          <div className="col col-md-6 ">
            <div className={'d-flex flex-row justify-content-end'}>
              <div className={'d-none d-lg-block pl-2'}>
                <div className="search-count-container ">
                  <span className="badge badge-pill badge-info p-2 mr-2">{`${capitalizeFirstLetter(
                    i18n['result_count']
                  )}: ${count}`}</span>
                </div>
              </div>
              <div>
                <nav aria-label="Results navigation">
                  <ReactPaginate
                    previousLabel={'❮'}
                    nextLabel={'❯'}
                    breakLabel={
                      <span className="break-button-content page-link" onClick={advanceByTwo}>
                        ...
                      </span>
                    }
                    breakClassName={'break-button break-button-upper'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    pageLinkClassName={'page-link'}
                    activeClassName={'active'}
                    forcePage={selectedPage}
                    pageClassName={'page-item page-item-upper'}
                    previousLinkClassName={'page-link'}
                    nextLinkClassName={'page-link'}
                    nextClassName={'next'}
                    previousClassName={'previous'}
                  />
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {dataset.length > 0 ? (
        <div>
          <div className={'table-responsive'}>
            <table id="usersTable" className={`table table-striped ${isLoading ? 'reduced-opacity' : ''}`}>
              <thead>
                <tr>
                  <th className={'text-nowrap'}>
                    <a
                      id="sort_by_name"
                      className={'sortable-header-name'}
                      href={''}
                      onClick={e => handleSort(e, 'last_name')}>
                      <span>{i18n['datatable']['name']}</span>
                      {sorting === 'last_name' ? (
                        ordering === 'asc' ? (
                          <span className={'sortable-icon-container'}>
                            <i className={'fas fa-sort-up fa-fw'} />
                          </span>
                        ) : (
                          <span className={'sortable-icon-container'}>
                            <i className={'fas fa-sort-down fa-fw'} />
                          </span>
                        )
                      ) : (
                        <i className={'fas fa-sort fa-fw'} />
                      )}
                    </a>
                  </th>
                  <th className={'text-nowrap'}>
                    <a
                      id="sort_by_email"
                      className={'sortable-header-name'}
                      href={''}
                      onClick={e => handleSort(e, 'email')}>
                      <span>{i18n['datatable']['email']}</span>
                      {sorting === 'email' ? (
                        ordering === 'asc' ? (
                          <span className={'sortable-icon-container'}>
                            <i className={'fas fa-sort-up fa-fw'} />
                          </span>
                        ) : (
                          <span className={'sortable-icon-container'}>
                            <i className={'fas fa-sort-down fa-fw'} />
                          </span>
                        )
                      ) : (
                        <i className={'fas fa-sort fa-fw'} />
                      )}
                    </a>
                  </th>
                  <th className={'text-nowrap'}>
                    <span>{i18n['datatable']['telephones']['title']}</span>
                  </th>
                  <th className={'text-nowrap'}>
                    <a
                      id="sort_by_date"
                      className={'sortable-header-name'}
                      href={''}
                      onClick={e => handleSort(e, 'created_at')}>
                      <span>{i18n['datatable']['registration']}</span>
                      {sorting === 'created_at' ? (
                        ordering === 'asc' ? (
                          <span className={'sortable-icon-container'}>
                            <i className={'fas fa-sort-up fa-fw'} />
                          </span>
                        ) : (
                          <span className={'sortable-icon-container'}>
                            <i className={'fas fa-sort-down fa-fw'} />
                          </span>
                        )
                      ) : (
                        <i className={'fas fa-sort fa-fw'} />
                      )}
                    </a>
                  </th>
                  <th className={'text-nowrap'}>
                    <span>{i18n['datatable']['actions']}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataset.map(entry => (
                  <tr className={'entry'} key={entry['id']}>
                    <td className={'align-middle text-nowrap'}>
                      <div className={'table-entry'}>
                        <Avatar data={entry['avatar']} />
                        <span>
                          <a className={'user-entry-color'} href={entry['view_entity_path']}>
                            {entry['name']}
                          </a>
                        </span>
                      </div>
                    </td>
                    <td className={'align-middle text-nowrap'}>
                      <div className={'table-entry'}>
                        <span>{entry['email']}</span>
                      </div>
                    </td>

                    <td className={'align-middle text-nowrap'}>
                      <div className={'table-entry'}>

                        {/*<span style={{letterSpacing: '0.1em', fontSize: '90%'}} className={`${entry['telephones'] === '—' ? '' : 'badge badge-success'}`}>*/}
                        <span style={{fontSize: '90%'}} className={`${entry['telephones'] === '—' ? '' : 'badge badge-success'}`}>
                          {entry['telephones']}
                        </span>
                        {/*<i className={'fas fa-phone-alt fa-fw'} />*/}
                      </div>
                    </td>

                    <td className={'align-middle'}>
                      <div className={'table-entry'}>
                        <span>{entry['registration']}</span>
                      </div>
                    </td>

                    <td className={'align-middle action-btns'}>
                      <a
                        title={i18n['datatable']['tooltip_freeze_profile']}
                        className="btn btn-md btn-icon btn-secondary btn-action "
                        href={entry['edit_entity_path']}>
                        <i className={`fas fa-pen`} />
                      </a>
                      <a
                        title={i18n['datatable']['tooltip_delete_profile']}
                        className={`btn btn-md btn-icon btn-secondary btn-action ${meta['is_admin'] ? '' : 'disabled'}`}
                        href={entry['view_entity_path']}
                        data-method="delete"
                        data-confirm="Are you sure?"
                        rel="nofollow">
                        <i className="fas fa-trash user-delete" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={'clearfix'} />
          <div className={'d-none d-md-block'}>
            <div className={'row d-flex justify-content-center'}>
              <nav aria-label="Results navigation">
                <ReactPaginate
                  previousLabel={'❮'}
                  nextLabel={'❯'}
                  breakLabel={
                    <span className="break-button-content page-link" onClick={advanceByTwo}>
                      ...
                    </span>
                  }
                  breakClassName={'break-button'}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  pageLinkClassName={'page-link'}
                  activeClassName={'active'}
                  forcePage={selectedPage}
                  pageClassName={'page-item'}
                  previousLinkClassName={'page-link'}
                  nextLinkClassName={'page-link'}
                  nextClassName={'next'}
                  previousClassName={'previous'}
                />
              </nav>
            </div>
          </div>
          <div>
            <div className={'d-xs-block d-sm-block d-md-none'}>
              <div className={'row d-flex justify-content-center'}>
                <nav aria-label="Results navigation">
                  <ReactPaginate
                    previousLabel={'❮'}
                    nextLabel={'❯'}
                    breakLabel={
                      <span className="break-button-content page-link" onClick={advanceByTwo}>
                        ...
                      </span>
                    }
                    breakClassName={'break-button break-button-upper'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    pageLinkClassName={'page-link'}
                    activeClassName={'active'}
                    forcePage={selectedPage}
                    pageClassName={'page-item page-item-upper'}
                    previousLinkClassName={'page-link'}
                    nextLinkClassName={'page-link'}
                    nextClassName={'next'}
                    previousClassName={'previous'}
                  />
                </nav>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`no-entries ${isLoading ? 'reduced-opacity' : ''}`}>
          <i className="no-results"> </i>
          <h3>{i18n['no_results']}</h3>
        </div>
      )}
    </div>
  );
};

ClientsList.propTypes = {
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

const ClientsListWithDatatable = withDatatable(ClientsList);

export default ClientsListWithDatatable;
