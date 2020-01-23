import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';
import Search from './Search';
import Spinner from './Spinner';
import Avatar from '../components/Avatar';
import { hasParams, capitalizeFirstLetter } from '../utilities/helpers';
import FormComponents from './fields/FormComponents';
import useFilterToggle from '../hooks/useFilterToggle';
import useTooltips from '../hooks/useTooltips';

const UsersList = ({
  handlePageClick,
  handleSort,
  handleAssign,
  handleChangeStatus,
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
  handleFreezeUser,
  handleAdminifyUser,
  handleCfieldDropdown,
  handleCfieldTextfield,
  handleCfieldCheckbox,
  status_filter,
  searchInput,
  users_path,
  cfields
}) => {
  const { filtersOpen, setFiltersOpen } = useFilterToggle('userFiltersOpen');
  const handleChange = event => setFiltersOpen(filtersOpen => !filtersOpen);
  useTooltips();

  return (
    <div className="users-list">
      <Spinner isLoading={isLoading} />
      <div className={'UserListContainer'}>
        <div className={'row'}>
          <div className={`filters col-12 col-xl-4 ${filtersOpen ? 'd-block' : 'd-none'} animated fadeIn`}>
            <div className="card">
              <div className="card-header">
                <div className="table-entry">
                  <div className="table-icon-wrapper">
                    <i className="pr-icon xs filters" />
                  </div>
                  <span className="align-middle">&nbsp; {i18n.filters.title}</span>
                  <div className="float-right">
                    <span className="badge badge-pill badge-success p-2 mr-2">{`${capitalizeFirstLetter(
                      i18n['result_count']
                    )}: ${count}`}</span>
                    <a className={'btn btn-outline-danger btn-sm'} href={users_path}>
                      {i18n.clear}
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <label className="d-block">
                  <h5 className="card-title filter-header">{i18n.filters.status.title}:</h5>
                </label>
                <div className="form-group">
                  {status_filter['options'].map(filter => (
                    <div key={filter['value']} className="custom-control custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="rdGroup1"
                        id={filter['value']}
                        value={filter['value']}
                        onChange={e => handleChangeStatus(e)}
                        checked={status_filter['storedOption'] === filter['value']}
                      />
                      <label className="custom-control-label" htmlFor={filter['value']}>
                        {filter['label']}
                      </label>
                    </div>
                  ))}
                </div>
                <hr />
                {cfields.fields.map((cfield, index) => {
                  return (
                    <FormComponents
                      key={index}
                      cfield={cfield}
                      storedSelection={cfields.storedSelections[Object.values(cfield)[0].slug] || null}
                      i18n={i18n.cfields}
                      handleCfieldDropdown={handleCfieldDropdown}
                      handleCfieldTextfield={handleCfieldTextfield}
                      handleCfieldCheckbox={handleCfieldCheckbox}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className={`d-block ${filtersOpen ? 'col-xl-8' : 'col-xl-12'}`}>
            <div className={'card'}>
              <div className={'card-body'}>
                <div className={'row'}>
                  <div className={'mb-3 custom-px d-flex flex-fill flex-nowrap'}>
                    <div className={'flex-grow-1'}>
                      <Search
                        handleSearchInput={handleSearchInput}
                        searchInput={searchInput}
                        placeholder={i18n['search']}
                      />
                    </div>
                    <div className={'btn-group btn-group-toggle pl-2'}>
                      <label
                        className={`btn ${hasParams() ? 'btn-danger' : 'btn-secondary'} toggle-button ${
                          filtersOpen ? 'active' : ''
                        }`}>
                        <input
                          name={'filter-toggle'}
                          type="checkbox"
                          checked={{ filtersOpen }}
                          onChange={handleChange}
                        />
                        <i className={'fas fa-filter fa-fw'} />
                        <span className="d-none d-md-inline">&nbsp;{i18n.filters.title}</span>
                      </label>
                    </div>

                    <div>
                      <div className={'d-none d-sm-block'}>
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
              {/*  </div>*/}
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
                          <th>
                            <a
                              id="sort_by_status"
                              className={'sortable-header-name'}
                              href={''}
                              onClick={e => handleSort(e, 'status')}>
                              <span>{i18n['datatable']['status']['title']}</span>
                            </a>
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
                          <th>
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
                                {entry['active'] ? (
                                  <span className="badge badge-success">{i18n['datatable']['status']['active']}</span>
                                ) : (
                                  <span className="badge badge-danger">{i18n['datatable']['status']['inactive']}</span>
                                )}
                              </div>
                            </td>

                            <td className={'align-middle text-nowrap'}>
                              <div className={'table-entry'}>
                                <span>{entry['registration']}</span>
                              </div>
                            </td>

                            <td className={'align-middle action-btns'}>
                              {meta['is_account_owner'] ? (
                                <a
                                  data-toggle="tooltip"
                                  data-placement="auto"
                                  onClick={e => handleAdminifyUser(e, meta['adminify_link'], entry['id'])}
                                  title={i18n['datatable']['tooltip_adminify_profile']}
                                  className={`btn btn-md btn-icon btn-secondary btn-action ${entry['privileged'] ? 'active' : ''}`}
                                  href={''}>
                                  <i className={`fas fa-angle-double-up ${entry['privileged'] ? 'blue' : ''}`} />
                                </a>
                              ) : ''}
                              <a
                                data-toggle="tooltip"
                                data-placement="auto"
                                onClick={e => handleFreezeUser(e, meta['freeze_link'], entry['id'])}
                                title={i18n['datatable']['tooltip_freeze_profile']}
                                className={`btn btn-md btn-icon btn-secondary btn-action ${
                                  entry['active'] ? '' : 'active'
                                }`}
                                href={''}>
                                <i className={`fas fa-user ${entry['active'] ? 'green' : 'red'}`} />
                              </a>
                              <a
                                data-toggle="tooltip"
                                data-position="auto"
                                title={i18n['datatable']['tooltip_edit_profile']}
                                className="btn btn-md btn-icon btn-secondary btn-action"
                                href={entry['edit_entity_path']}>
                                <i className="fas fa-pen" />
                              </a>
                              <a
                                data-toggle="tooltip"
                                data-position="auto"
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
                <div className={`no-entries ${isLoading ? 'reduced-opacity' : ''}`}>
                  <i className="no-results"> </i>
                  <h3>{i18n['no_results']}</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
