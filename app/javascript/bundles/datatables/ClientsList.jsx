import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';
import Search from './Search';
import Spinner from './Spinner';
import Avatar from '../components/Avatar';
import { capitalizeFirstLetter, hasParams } from '../utilities/helpers';
import useFilterToggle from '../hooks/useFilterToggle';
import FormComponents from './fields/FormComponents';
import useTooltips from '../hooks/useTooltips';
import useMultiCheckbox from '../hooks/useMultiCheckbox';
import ModalControlStrip from "../components/modals/ModalControlStrip";

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
  searchInput,
  handleCfieldDropdown,
  handleCfieldTextfield,
  handleCfieldCheckbox,
  clients_path,
  cfields,
}) => {
  const { filtersOpen, setFiltersOpen } = useFilterToggle('clientFiltersOpen');
  const handleChange = event => setFiltersOpen(filtersOpen => !filtersOpen);
  const { checkedItems, masterCheck, checkAll, handleCheckboxChange } = useMultiCheckbox(
    dataset.map(entry => entry.id),
    selectedPage
  );

  useTooltips();

  return (
    <div className="clients-list">
      <Spinner isLoading={isLoading} />
      <div className={'ClientListContainer'}>
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
                    <a className={'btn btn-outline-danger btn-sm'} href={clients_path}>
                      {i18n.clear}
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {cfields.fields.length > 0 ? (
                  cfields.fields.map((cfield, index) => {
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
                  })
                ) : (
                  <div>
                    {/*<p className={'text-justify font-italic mb-4'}>{i18n.filters.nocfields_html}</p>*/}
                    <p className={'text-justify font-italic mb-4'}>
                      <span dangerouslySetInnerHTML={{ __html: i18n.filters.nocfields_html }} />
                    </p>
                    <div className={'text-center'}>
                      <img alt={'no-cfields'} src={cfields.nocfieldsimg} className={'img-fluid max-300 text-center'} />
                    </div>
                  </div>
                )}
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
                      {meta['is_admin'] ? (
                        <>
                          <ModalControlStrip
                            entries={[
                              {
                                name: 'MassActions',
                                button: {
                                  content: `<i class='fas fa-tasks fa-lg fa-fw'/>`,
                                  size: 'md',
                                  classname: 'btn-success action-toolbar-group-btn',
                                  tooltip: i18n.button.tooltip,
                                  isDisabled: !Object.keys(checkedItems).some(i => checkedItems[i])
                                },
                                modal: {
                                  id: 'client-list-modal',
                                  i18n: i18n,
                                  title: i18n.modal.mass_actions.title,
                                  buttonCloseLabel: i18n.modal.mass_actions.close_btn,
                                  origin: 'menu',
                                  checkedItems: checkedItems,
                                  massDeletePersonsEndpoint: meta.mass_delete_clients_link,
                                  massFreezePersonsEndpoint: ''
                                },
                              },
                            ]}
                          />

                          {Object.keys(checkedItems).filter(i => checkedItems[i]).length ? (
                            <div className={'d-flex align-items-center justify-content-center user-assign-counter'}>
                              <strong>{Object.keys(checkedItems).filter(i => checkedItems[i]).length}</strong>
                            </div>
                          ) : null}
                        </>
                      ) : null}
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
              {/*  GOOD */}
              {dataset.length > 0 ? (
                <div>
                  <div className={'table-responsive'}>
                    <table id="usersTable" className={`table table-striped ${isLoading ? 'reduced-opacity' : ''}`}>
                      <thead>
                        <tr>
                          <th>
                            {meta['is_admin'] ? (
                              <div className="custom-control custom-checkbox d-inline-block">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  name={'master-check-clients'}
                                  id={'master-check-clients'}
                                  checked={!!masterCheck[selectedPage + 1]}
                                  onChange={() => checkAll()}
                                />
                                <label className="custom-control-label" htmlFor={'master-check-clients'} />
                              </div>
                            ) : (
                              ''
                            )}
                            <a
                              id="sort_by_name"
                              className={'sortable-header-name d-inline-block'}
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
                                {meta['is_admin'] ? (
                                  <div className="custom-control custom-checkbox d-inline-block">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      name={entry['id']}
                                      id={entry['id']}
                                      checked={!!checkedItems[entry['id']]}
                                      onChange={handleCheckboxChange}
                                    />
                                    <label className="custom-control-label" htmlFor={entry['id']} />
                                  </div>
                                ) : (
                                  ''
                                )}
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
                                <span
                                  style={{ fontSize: '90%' }}
                                  className={`${entry['telephones'] === '—' ? '' : 'badge badge-success'}`}>
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
                                data-toggle="tooltip"
                                data-position="top"
                                title={i18n['datatable']['tooltip_edit_profile']}
                                className="btn btn-md btn-icon btn-secondary btn-action "
                                href={entry['edit_entity_path']}>
                                <i className={`fas fa-pen`} />
                              </a>
                              <a
                                data-toggle="tooltip"
                                data-position="top"
                                title={i18n['datatable']['tooltip_delete_profile']}
                                className={`btn btn-md btn-icon btn-secondary btn-action ${
                                  meta['is_admin'] ? '' : 'disabled'
                                }`}
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

ClientsList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  dataset: PropTypes.array.isRequired,
  advanceByTwo: PropTypes.func.isRequired,
  handleSort: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  handlePageClick: PropTypes.func.isRequired,
  selectedPage: PropTypes.number.isRequired,
  sorting: PropTypes.string.isRequired,
  ordering: PropTypes.string.isRequired,
};

const ClientsListWithDatatable = withDatatable(ClientsList);

export default ClientsListWithDatatable;
