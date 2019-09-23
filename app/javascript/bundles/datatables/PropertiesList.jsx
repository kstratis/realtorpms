import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';
import ClampWrapper from '../components/ClampWrapper';
import SortFilter from './SortFilter';
import FlipMove from 'react-flip-move';
import AssociativeFormSelect from '../components/selects/AssociativeFormSelect';
import Spinner from './Spinner';
import PropertyEntry from './PropertyEntry';
import URLSearchParams from '@ungap/url-search-params';
import ModalContainer from '../components/ModalContainer';
import AsyncSelectContainer from '../components/selects/AsyncSelectContainer';

// Disable the save search button when no params are available
const hasParams = () => {
  let searchParams = new URLSearchParams(window.location.search);
  let param_counter = 0;
  for (let p of searchParams) {
    // count these out
    if (['page', 'sizeminmeta', 'sizemaxmeta', 'ordering', 'sorting'].indexOf(p[0]) === -1) {
      param_counter = param_counter + 1;
    }
  }
  return param_counter > 0;
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
  locations_filter,
  advanceByTwo,
  isLoading,
  dataset,
  pageCount,
  selectedPage,
  sorting,
  ordering,
  count,
  handleCategoryInput,
  locations_endpoint,
  clients_endpoint,
  assignmentships_endpoint,
  properties_path,
  i18n
}) => {
  const [filtersOpen, setFiltersOpen] = useState(() => JSON.parse(localStorage.getItem('filtersOpen')));

  useEffect(() => {
    localStorage.setItem('filtersOpen', filtersOpen);
  }, [filtersOpen]);

  const handleChange = event => setFiltersOpen(filtersOpen => !filtersOpen);

  return (
    <div className="properties-list">
      <div className={'PropertyListContainer'}>
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

          <div className={`${filtersOpen ? 'col-xl-8' : 'col-xl-12'}`}>
            <div className={'row'}>
              {/* Generate the needed filters according to the i18n keys of the erb template */}
              <div className={'mb-3 custom-px d-flex flex-fill flex-nowrap'}>
                <div className={'flex-grow-1'}>
                  <AsyncSelectContainer
                    id={'AsyncSelectContainer'}
                    i18n={i18n}
                    collection_endpoint={{ url: locations_endpoint, action: 'get' }}
                    action_endpoint={{ url: '', action: '', callback: handleLocationInput }}
                    storedOptions={locations_filter['storedOptions']}
                    hasFeedback={false}
                    isCreatable={false}
                  />
                </div>
                <div className={'btn-group btn-group-toggle pl-2'}>
                  <label
                    className={`btn ${hasParams() ? 'btn-danger' : 'btn-secondary'} toggle-button ${
                      filtersOpen ? 'active' : ''
                    }`}>
                    <input name={'filter-toggle'} type="checkbox" checked={{ filtersOpen }} onChange={handleChange} />
                    <i className={'fas fa-filter fa-fw'} />
                    <span className="d-none d-md-inline">&nbsp;{i18n.filters.title}</span>
                  </label>
                </div>
                <div className={'flex-shrink-1 text-center'}>
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
                <div className={``}>
                  <ModalContainer
                    id={'modal-window'}
                    fireButtonLabel={`<i class='fas fa-save fa-lg fa-fw' />`}
                    fireButtonBtnSize={`md`}
                    fireButtonBtnType={`success`}
                    avatar={null}
                    modalTitle={i18n.search_save_title}
                    modalHeader={i18n.search_save_subtitle}
                    child={'StoreClientSearch'}
                    buttonCloseLabel={i18n.search_save_buttonCloseLabel}
                    ajaxEnabled={true}
                    isClearable={true}
                    backspaceRemovesValue={true}
                    isSearchable={true}
                    i18n={i18n}
                    buttonDisabled={!hasParams()}
                    clientsEndpoint={clients_endpoint}
                    assignmentshipsEndpoint={assignmentships_endpoint}
                    i18nPriceOptions={price_filter['options']}
                    i18nSizeOptions={size_filter['options']}
                    i18nFloorOptions={floors_filter['options']}
                    i18nCategoryOptions={category_filter['options']}
                  />
                </div>
              </div>
            </div>

            <Spinner isLoading={isLoading} version={2} />
            {dataset.length > 0 ? (
              <>
                <div className={`row relativeposition ${isLoading ? 'reduced-opacity' : ''}`}>
                  <FlipMove typeName={null}>
                    {dataset.map((entry, index) => (
                      <PropertyEntry key={entry.slug} entry={entry} filtersOpen={filtersOpen}/>
                    ))}
                  </FlipMove>
                </div>

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
                      pageLinkClassName={`page-link ${isLoading ? 'disabled' : ''}`}
                      activeClassName={'active'}
                      forcePage={selectedPage}
                      pageClassName={'page-item'}
                      previousLinkClassName={`page-link ${isLoading ? 'disabled' : ''}`}
                      nextLinkClassName={`page-link ${isLoading ? 'disabled' : ''}`}
                      nextClassName={'next'}
                      previousClassName={'previous'}
                    />
                  </nav>
                </div>
              </>
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
