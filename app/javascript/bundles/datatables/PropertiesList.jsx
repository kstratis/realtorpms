import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';
import ClampWrapper from '../components/ClampWrapper';
import SortFilter from './SortFilter';
import AsyncSelect from '../components/selects/AsyncSelect';
import FlipMove from 'react-flip-move';
import AssociativeFormSelect from '../components/selects/AssociativeFormSelect';
import Spinner from './Spinner';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

const PropertiesList = ({
  handleLocationInput,
  handlePriceInput,
  handleSizeInput,
  handleRoomsInput,
  handleFloorsInput,
  handleConstructionInput,
  handleChangePurpose,
  handlePageClick,
  handleSort,
  buysell_filter,
  category_filter,
  price_filter,
  size_filter,
  rooms_filter,
  floors_filter,
  construction_filter,
  propertyType,
  handleAssign,
  handleFav,
  advanceByTwo,
  isLoading,
  dataset,
  pageCount,
  selectedPage,
  sorting,
  ordering,
  count,
  searchInput,
  handleSearchInput,
  handleCategoryInput,
  locations_endpoint,
  properties_path,
  i18n
}) => {
  return (
    <div className="properties-list">
      {/* CARD START */}

      {/*{isLoading ? (*/}
      {/*  <div className={'centered'}>*/}
      {/*    <div className={'spinner'} />*/}
      {/*  </div>*/}
      {/*) : null}*/}

      <div className={'PropertyListContainer'}>
        <div className={'row'}>
          <div className={'filters col-5'}>
            <div className="card">
              <div className="card-header">
                <div className="table-entry">
                  <div className="table-icon-wrapper">
                    <i className="pr-icon xs filters" />
                  </div>
                  <span className="align-middle">&nbsp; {i18n.filters.title}</span>
                  <div className="float-right">
                    <span className="badge badge-pill badge-success p-2 mr-2">{`${i18n.entry_count}: ${count}`}</span>
                    <a className={'btn btn-outline-danger btn-sm'} href={properties_path}>
                      {i18n.clear}
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <label className="d-block">
                  <h5 className="card-title filter-header">{i18n.filters.type.title}:</h5>
                </label>
                <div className="form-group">
                  {buysell_filter['options'].map(filter => (
                    <div key={filter['value']} className="custom-control custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="rdGroup1"
                        id={filter['value']}
                        value={filter['value']}
                        onChange={e => handleChangePurpose(e)}
                        checked={buysell_filter['storedOption'] === filter['value']}
                      />
                      <label className="custom-control-label" htmlFor={filter['value']}>
                        {filter['label']}
                      </label>
                    </div>
                  ))}
                </div>
                <hr />
                <h5 className="card-title filter-header">{i18n.select.category}:</h5>
                <AssociativeFormSelect
                  key={'associative-category'}
                  name={'category'}
                  options={category_filter['options']}
                  i18n={i18n}
                  mode={'associative'}
                  renderFormFields={false}
                  cleanupParams={false}
                  callback={handleCategoryInput}
                  isClearable={true}
                  isSearchable={false}
                  renderLabels={false}
                  placeholderTextMaster={i18n.select.placeholder_plain}
                  placeholderTextSlave={i18n.select.placeholder_plain}
                  storedMasterOption={category_filter['storedMasterOption']}
                  storedSlaveOption={category_filter['storedSlaveOption']}
                />
                <hr />
                <h5 className="card-title filter-header">{i18n.price}:</h5>
                <AssociativeFormSelect
                  key={'range-price'}
                  name={'price'}
                  options={price_filter['options']}
                  i18n={i18n}
                  mode={'range'}
                  renderFormFields={false}
                  callback={handlePriceInput}
                  isClearable={true}
                  isSearchable={false}
                  renderLabels={false}
                  placeholderTextMaster={i18n.select.placeholder_prices_min}
                  placeholderTextSlave={i18n.select.placeholder_prices_max}
                  storedControllerOption={buysell_filter['storedOption']}
                  storedMasterOption={price_filter['storedMasterOption']}
                  storedSlaveOption={price_filter['storedSlaveOption']}
                />
                <hr />
                <h5 className="card-title filter-header">{i18n.size}:</h5>
                <AssociativeFormSelect
                  key={'range-size'}
                  name={'size'}
                  options={size_filter['options']}
                  i18n={i18n}
                  mode={'range'}
                  renderFormFields={false}
                  callback={handleSizeInput}
                  isClearable={true}
                  isSearchable={false}
                  renderLabels={false}
                  placeholderTextMaster={i18n.select.placeholder_sizes_min}
                  placeholderTextSlave={i18n.select.placeholder_sizes_max}
                  storedControllerOption={size_filter['propertyType']}
                  storedMasterOption={size_filter['storedMasterOption']}
                  storedSlaveOption={size_filter['storedSlaveOption']}
                />
                <hr />
                <h5 className="card-title filter-header">{i18n.rooms}:</h5>
                <AssociativeFormSelect
                  key={'range-rooms'}
                  name={'rooms'}
                  options={rooms_filter['options']}
                  i18n={i18n}
                  mode={'range'}
                  renderFormFields={false}
                  callback={handleRoomsInput}
                  isClearable={true}
                  isSearchable={false}
                  renderLabels={false}
                  placeholderTextMaster={i18n.select.placeholder_rooms_min}
                  placeholderTextSlave={i18n.select.placeholder_rooms_max}
                  storedControllerOption={rooms_filter['propertyType']}
                  storedMasterOption={rooms_filter['storedMasterOption']}
                  storedSlaveOption={rooms_filter['storedSlaveOption']}
                />
                <hr />
                <h5 className="card-title filter-header">{i18n.floors}:</h5>
                <AssociativeFormSelect
                  key={'range-floors'}
                  name={'floors'}
                  options={floors_filter['options']}
                  i18n={i18n}
                  mode={'range'}
                  renderFormFields={false}
                  callback={handleFloorsInput}
                  isClearable={true}
                  isSearchable={false}
                  renderLabels={false}
                  placeholderTextMaster={i18n.select.placeholder_floors_min}
                  placeholderTextSlave={i18n.select.placeholder_floors_max}
                  storedControllerOption={floors_filter['propertyType']}
                  storedMasterOption={floors_filter['storedMasterOption']}
                  storedSlaveOption={floors_filter['storedSlaveOption']}
                />
                <hr />
                <h5 className="card-title filter-header">{i18n.construction}:</h5>
                <AssociativeFormSelect
                  key={'range-construction'}
                  name={'construction'}
                  options={construction_filter['options']}
                  i18n={i18n}
                  mode={'range'}
                  renderFormFields={false}
                  callback={handleConstructionInput}
                  isClearable={true}
                  isSearchable={false}
                  renderLabels={false}
                  placeholderTextMaster={i18n.select.placeholder_construction_min}
                  placeholderTextSlave={i18n.select.placeholder_construction_max}
                  storedControllerOption={construction_filter['propertyType']}
                  storedMasterOption={construction_filter['storedMasterOption']}
                  storedSlaveOption={construction_filter['storedSlaveOption']}
                />
              </div>
            </div>
          </div>
          <div className={'col-7'}>
            {/* Generate the needed filters according to the i18n keys of the erb template */}
            <div className={'row mb-3'}>
              <div className={'col-lg-6 col-sm-12 mb-3 mb-lg-0'}>
                <AsyncSelect
                  i18n={i18n}
                  collection_endpoint={{ url: locations_endpoint, action: 'get' }}
                  action_endpoint={{ url: '', action: '', callback: handleLocationInput }}
                />
              </div>
              <div className={'col-lg-6 col-sm-12'}>
                <SortFilter
                  handleFn={handleSort}
                  slug={'created_at'}
                  title={i18n.filters.sortByDate.title}
                  currentSorting={sorting}
                  currentOrdering={ordering}
                  options={[
                    {
                      sn: 0,
                      text: i18n.filters.sortByDate.option1,
                      sort_filter: 'created_at',
                      sort_order: 'desc',
                      icon: 'fas fa-sort-amount-up fa-fw'
                    },
                    {
                      sn: 1,
                      text: i18n.filters.sortByDate.option2,
                      sort_filter: 'created_at',
                      sort_order: 'asc',
                      icon: 'fas fa-sort-amount-down fa-fw'
                    }
                  ]}
                />
              </div>
            </div>
            <Spinner isLoading={isLoading} version={2} />
            {dataset.length > 0 ? (
              <div className={`${isLoading ? 'reduced-opacity' : ''}`}>
                <FlipMove>
                  {dataset.map((entry, index) => (
                    <div key={entry.id}>
                      <div className={'row'}>
                        <div className="col-12">
                          <div className="list-group list-group-media mb-3">
                            <a href={entry['allow_view'] ? entry['view_entity_path'] : ''}
                              className="list-group-item list-group-item-action">
                              <div className="list-group-item-figure rounded-left">
                                <div className={`thumb-container ${entry['allow_view'] ? '' : 'frosty'}`}>
                                  {entry['avatar'] ? (
                                    <img src={entry['avatar']} alt="placeholder image" className={'thumb'} />
                                  ) : (
                                    <i className={'pr-icon md house-avatar-placeholder'} />
                                  )}
                                </div>
                              </div>
                              <div className="list-group-item-body">
                                <div className={'row'}>
                                  {!entry['allow_view']
                                    ? (
                                      <div className={'col-12'}>

                                          <div><h2>{entry['id']}</h2></div>
                                          <div><h3>{entry['access_msg']}</h3></div>

                                      </div>
                                  ) : (
                                    <>
                                      <div className={'col-8'}>
                                        <h4 className="list-group-item-title">{entry.mini_heading}</h4>
                                        <p className="">{entry.location}</p>
                                        <p className="list-group-item-text clamp-3">{entry.description}</p>
                                      </div>
                                      <div className={'col-4'}>
                                        <p className="list-group-item-text purpose">{entry.purpose}</p>
                                        <p className="list-group-item-text text-right mt-2">{entry.price}</p>
                                        <p className="list-group-item-text text-right">{entry.size}</p>
                                        <p className="list-group-item-text text-right">{entry.pricepersqmeter}</p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </FlipMove>

                {/* CARD END */}
                <div className={'clearfix'} />

                <ClampWrapper />

                <div className={'row d-flex justify-content-center mt-4'}>
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
                      pageClassName={'page-item'}
                      previousLinkClassName={'page-link'}
                      nextLinkClassName={'page-link'}
                      nextClassName={'next'}
                      previousClassName={'previous'}
                    />
                  </nav>
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
  );
};

PropertiesList.propTypes = {
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

const PropertiesListWithDatatable = withDatatable(PropertiesList);

export default PropertiesListWithDatatable;
