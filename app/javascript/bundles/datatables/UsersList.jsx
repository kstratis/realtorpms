import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';
import Search from './Search';
import Spinner from './Spinner';

const UsersList = ({
  handlePageClick,
  handleSort,
  handleAssign,
  advanceByTwo,
  isLoading,
  dataset,
  pageCount,
  selectedPage,
  sorting,
  ordering,
  count,
  i18n,
  handleSearchInput,
  handleFreezeUser,
  searchInput
}) => {
  return (
    <div className="user-list">
      <Spinner isLoading={isLoading} />
      <div className={'container'}>
        <div className={'row'}>
          <Search handleSearchInput={handleSearchInput} searchInput={searchInput} placeholder={i18n['search']} />
          <div className="col col-md-6 d-none d-md-block">
            <div className={'d-flex flex-row justify-content-end'}>
              <div className="search-count-container">
                <div>
                  <strong className={'count'}>{count}</strong> <span>{i18n['result_count']}</span>
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
                  <th>
                    <a
                      id="sort_by_name"
                      className={'sortable-header-name'}
                      href={''}
                      onClick={e => handleSort(e, 'last_name')}>
                      <span>{i18n['datatable']['partner']}</span>
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
                  <th>
                    <a
                      id="sort_by_email"
                      className={'sortable-header-name'}
                      href={''}
                      // onClick={e => handleSort(e, 'email', 'asc')}>
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
                  {/*<th><span>{i18n['datatable']['usertype']}</span></th>*/}
                  <th>
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
                  <th>
                    <span>{i18n['datatable']['actions']}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataset.map(entry => (
                  <tr key={entry['id']}>
                    <td className={'align-middle'}>
                      <div className={'table-entry'}>
                        <img className="avatar-table-entry" src={entry['avatar_url']} />
                        <span>
                          <a className={'user-entry-color'} href={entry['view_entity_path']}>
                            {entry['name']}
                          </a>
                        </span>
                      </div>
                    </td>
                    <td className={'align-middle'}>
                      <div className={'table-entry'}>
                        <span>{entry['email']}</span>
                      </div>
                    </td>

                    {/*<td>*/}
                    {/*<div className={'table-entry'}>*/}
                    {/*<span>{entry['type'] ? i18n['datatable']['admin'] : i18n['datatable']['user']}</span>*/}
                    {/*</div>*/}
                    {/*</td>*/}

                    <td className={'align-middle'}>
                      <div className={'table-entry'}>
                        <span>{entry['registration']}</span>
                      </div>
                    </td>

                    <td className={'align-middle action-btns'}>
                      {/*<div className="action-buttons-container table-entry">*/}
                      {/*<div className="btn-group min-width" role="group" aria-label="...">*/}
                      {/*<div className="btn-group">*/}

                      {/*<div className="btn-group" role="group" aria-label="...">*/}
                      {/*<a title={i18n['datatable']['tooltip_view_profile']} className="btn btn-default"*/}
                      {/*href={entry['view_entity_path']}>*/}
                      {/*<i className="pr-icon action-button-graphic xs bar-chart"> </i>*/}
                      {/*</a>*/}
                      {/*</div>*/}

                      {/*<div className="btn-group" role="group" aria-label="...">*/}
                      <a
                        onClick={e => handleFreezeUser(e)}
                        title={i18n['datatable']['tooltip_edit_profile']}
                        className="btn btn-md btn-icon btn-secondary btn-action "
                        href={''}>
                        <i className="fas fa-id-card-alt" />
                      </a>
                      {/*</div>*/}

                      {/*<div className="btn-group" role="group" aria-label="...">*/}
                      <a
                        title={i18n['datatable']['tooltip_delete_profile']}
                        className="btn btn-md btn-icon btn-secondary btn-action"
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
        <div className={`no-tasks ${isLoading ? 'reduced-opacity' : ''}`}>
          <i className="no-results"> </i>
          <h3>{i18n['no_results']}</h3>
        </div>
      )}
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
