import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast';
import withDatatable from './withDatatable';
import ClampWrapper from '../components/ClampWrapper';
import SortFilter from './SortFilter';
import Spinner from './Spinner';
import PropertyEntry from './PropertyEntry';
import AsyncSelectContainer from '../components/selects/AsyncSelectContainer';
import useFilterToggle from '../hooks/useFilterToggle';
import { hasParams, comesFromClient } from '../utilities/helpers';
import ModalControlStrip from '../components/modals/ModalControlStrip';
import FiltersRenderer from './FiltersRenderer';
import AssociativeFormSelect from '../components/selects/AssociativeFormSelect';
import FormComponents from './fields/FormComponents';

const PropertiesList = ({
  accountFlavor,
  handleLocationInput,
  handlePriceInput,
  handleSizeInput,
  handleRoomsInput,
  handleFloorsInput,
  handleConstructionInput,
  handleChangePurpose,
  handlePageClick,
  handleSort,
  handleCfieldDropdown,
  handleCfieldTextfield,
  handleCfieldCheckbox,
  handleActiveOnlyFilter,
  handleSpitogatosSyncFilter,
  buysell_filter,
  category_filter,
  price_filter,
  size_filter,
  rooms_filter,
  floors_filter,
  active_only_filter,
  spitogatos_sync_filter,
  construction_filter,
  locations_filter,
  advanceByTwo,
  handleClone,
  handleSpitogatosSync,
  isLoading,
  dataset,
  pageCount,
  selectedPage,
  sorting,
  ordering,
  count,
  cfields,
  handleCategoryInput,
  locations_endpoint,
  clients_endpoint,
  assignmentships_endpoint,
  properties_path,
  showControls,
  new_property_endpoint,
  create_new_entity_form,
  forceFiltersOpen,
  preselectedClient,
  i18n,
  spitogatosEnabled,
}) => {
  const { filtersOpen, setFiltersOpen } = useFilterToggle('propertyFiltersOpen', forceFiltersOpen);
  const handleChange = event => setFiltersOpen(filtersOpen => !filtersOpen);

  const [activeOnlyFilterChecked, setActiveOnlyFilterChecked] = useState(() => (active_only_filter['isChecked'] ? !!active_only_filter['isChecked'] : ''));
  const [spitogatosSyncFilterChecked, setSpitogatosSyncFilterChecked] = useState(() => (spitogatos_sync_filter['isChecked'] ? !!spitogatos_sync_filter['isChecked'] : ''));

  const handleActiveOnlyChange = e => {
    setActiveOnlyFilterChecked(e.target.checked);
    handleActiveOnlyFilter(e.target.checked);
  };

  const handleSpitogatosSyncChange = e => {
    setSpitogatosSyncFilterChecked(e.target.checked);
    handleSpitogatosSyncFilter(e.target.checked);
  };

  const clearHandler = e => {
    e.preventDefault();
    toast.remove();
    if (window.innerWidth < 1200) setFiltersOpen(false);
    Turbolinks.visit(properties_path);
  };

  // React hot toast does not yet support a dismiss button.
  // Until then use jquery to simulate a dismiss button
  // References:
  // https://react-hot-toast.com/docs/version-2
  // https://github.com/timolins/react-hot-toast/issues/7
  useEffect(() => {
    $(document).on('click', '.client-search-toast', () => {
      toast.dismiss();
    });
  }, []);

  useEffect(() => {
    if (comesFromClient()) {
      toast(i18n.toast, {
        duration: Infinity,
        position: 'bottom-right',
        className: 'client-search-toast',
        icon: '🔍',
        style: {
          borderRadius: '10px',
          background: 'gold',
          color: '#333',
        },
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
    }
    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <div className="properties-list">
      <div>
        <Toaster />
      </div>

      <div className={'PropertyListContainer'}>
        <div className={'row'}>

          {/* Side Drawer Content - Filters */}
          <FiltersRenderer i18n={i18n} filtersOpen={filtersOpen} handleChange={handleChange}>
            <div className="card unset-card-box-shadow mb-5">
              <div className="card-header">
                <div className="table-entry">
                  <div className="table-icon-wrapper">
                    <i className="pr-icon xs filters" />
                  </div>
                  <span className="align-middle">&nbsp; {i18n.filters.title}</span>
                  <div className="float-right">
                    <span className="badge badge-pill badge-success p-2 mr-2">{`${i18n.entry_count}: ${count}`}</span>
                    <a
                      className={'btn btn-outline-danger btn-sm'}
                      href={''}
                      onClick={e => {
                        clearHandler(e);
                      }}>
                      {i18n.clear}
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-body col-md-6 offset-md-3 col-xl-12 offset-xl-0">
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
                <hr />

                <label className="d-block">
                  <h5 className="card-title filter-header">{i18n.status_title}:</h5>
                </label>
                <div className={'mb-3'}>
                  <div className="form-group mb-4">
                    <div className="custom-control custom-checkbox app-checkbox custom-field-checkbox">
                      <input
                          id={'active'}
                          type="checkbox"
                          name={'active'}
                          className="custom-control-input"
                          checked={!!activeOnlyFilterChecked}
                          onChange={handleActiveOnlyChange}
                      />
                      <label htmlFor={'active'} className={'custom-control-label'}>
                        {i18n.status_active_only}
                      </label>
                    </div>
                  </div>
                </div>

                {accountFlavor === 'greek' ? (
                    <>
                      <hr />
                      <label className="d-block">
                        <h5 className="card-title filter-header">{i18n.sync_title}:</h5>
                      </label>
                      <div className={'mb-3'}>
                        <div className="form-group mb-4">
                          <div className="custom-control custom-checkbox app-checkbox custom-field-checkbox">
                            <input
                                id={'spitogatosSync'}
                                type="checkbox"
                                name={'spitogatosSync'}
                                className="custom-control-input"
                                checked={!!spitogatosSyncFilterChecked}
                                onChange={handleSpitogatosSyncChange}
                            />
                            <label htmlFor={'spitogatosSync'} className={'custom-control-label'}>
                              {i18n.sync_body}
                            </label>
                          </div>
                        </div>
                      </div>
                    </>) : ''}

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
          </FiltersRenderer>

          <div className={`${filtersOpen ? 'col-lg-12 col-xl-8' : 'col-lg-12'}`}>
            <div className={'card'}>
              <div className={'card-body'}>
                <div className={'row'}>
                  {/* Generate the needed filters according to the i18n keys of the erb template */}
                  <div className={'custom-px d-flex flex-fill flex-nowrap'}>
                    <div className={'flex-grow-1'}>
                      <AsyncSelectContainer
                        id={'AsyncSelectContainer'}
                        i18n={i18n}
                        htmlPlaceholder={<span><i className={'fas fa-search fa-fw'}></i>&nbsp;&nbsp;&nbsp;{i18n.select.placeholder}</span>}
                        collection_endpoint={{ url: locations_endpoint, action: 'get' }}
                        action_endpoint={{ url: '', action: '', callback: handleLocationInput }}
                        create_new_entity_form={create_new_entity_form}
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
                            icon: 'fas fa-sort-amount-up fa-fw',
                          },
                          {
                            sn: 1,
                            text: i18n.filters.sortByDate.option2,
                            sort_filter: 'created_at',
                            sort_order: 'asc',
                            icon: 'fas fa-sort-amount-down fa-fw',
                          },
                          {
                            sn: 1,
                            text: i18n.filters.sortByPrice.option1,
                            sort_filter: 'price',
                            sort_order: 'asc',
                            icon: 'fas fa-coins fa-fw',
                          },
                          {
                            sn: 0,
                            text: i18n.filters.sortByPrice.option2,
                            sort_filter: 'price',
                            sort_order: 'desc',
                            icon: 'fas fa-money-bill fa-fw',
                          },
                        ]}
                      />
                    </div>
                    <div>
                      <ModalControlStrip
                        entries={[
                          {
                            name: 'StoreClientSearch',
                            button: {
                              content: `<i class='fas fa-save fa-lg fa-fw'/>`,
                              size: 'md',
                              classname: `btn-success ${!!forceFiltersOpen ? 'pulsing-button' : ''}`,
                              tooltip: i18n.search_save_title,
                              isDisabled: !hasParams(),
                            },
                            modal: {
                              i18n: i18n,
                              avatar: null,
                              title: i18n.search_save_title,
                              buttonCloseLabel: i18n.search_save_buttonCloseLabel,
                              ajaxEnabled: true,
                              isClearable: true,
                              backspaceRemovesValue: true,
                              storedOptions: preselectedClient,
                              isSearchable: true,
                              clientsEndpoint: clients_endpoint,
                              assignmentshipsEndpoint: assignmentships_endpoint,
                              create_new_entity_form: create_new_entity_form,
                              i18nPriceOptions: price_filter['options'],
                              i18nSizeOptions: size_filter['options'],
                              i18nFloorOptions: floors_filter['options'],
                              i18nCategoryOptions: category_filter['options'],
                              i18nCfieldOptions: cfields['options'],
                            },
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Spinner isLoading={isLoading} version={2} />
            {dataset.length > 0 ? (
              <>
                <div className={`row relativeposition ${isLoading ? 'reduced-opacity' : ''}`}>
                  {dataset.map((entry, index) => (
                    <PropertyEntry
                      key={entry.slug}
                      entry={entry}
                      userEditable={entry['userEditable']}
                      filtersOpen={filtersOpen}
                      handleClone={handleClone}
                      handleSpitogatosSync={handleSpitogatosSync}
                      i18n={i18n}
                      showControls={showControls}
                      active={entry['active']}
                      spitogatosEnabled={spitogatosEnabled}
                    />
                  ))}
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
                <i className="no-results-properties"> </i>
                <h3>{i18n['no_results']}</h3>
                <a href={new_property_endpoint} className={'btn btn-lg btn-outline-primary'}>
                  {i18n['new_property_cta']}
                </a>
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
  ordering: PropTypes.string.isRequired,
};

const PropertiesListWithDatatable = withDatatable(PropertiesList);

export default PropertiesListWithDatatable;
