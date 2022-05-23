import PropTypes from 'prop-types';
import React, { useState, useEffect, useLayoutEffect } from 'react';
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
import FilterDrawer from './FilterDrawer';

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
  handleCfieldDropdown,
  handleCfieldTextfield,
  handleCfieldCheckbox,
  buysell_filter,
  category_filter,
  price_filter,
  size_filter,
  rooms_filter,
  floors_filter,
  construction_filter,
  locations_filter,
  advanceByTwo,
  handleClone,
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
  i18n,
}) => {
  const { filtersOpen, setFiltersOpen } = useFilterToggle('propertyFiltersOpen', forceFiltersOpen);
  const handleChange = event => setFiltersOpen(filtersOpen => !filtersOpen);

  const clearHandler = e => {
    e.preventDefault();
    toast.remove();
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
          {/* Side Drawer Content */}
          <FilterDrawer
            filtersOpen={filtersOpen}
            handleChange={handleChange}
            clearHandler={clearHandler}
            count={count}
            buysell_filter={buysell_filter}
            handlePriceInput={handlePriceInput}
            handleSizeInput={handleSizeInput}
            handleRoomsInput={handleRoomsInput}
            handleFloorsInput={handleFloorsInput}
            handleConstructionInput={handleConstructionInput}
            handleChangePurpose={handleChangePurpose}
            handleCfieldDropdown={handleCfieldDropdown}
            handleCfieldTextfield={handleCfieldTextfield}
            handleCfieldCheckbox={handleCfieldCheckbox}
            rooms_filter={rooms_filter}
            construction_filter={construction_filter}
            category_filter={category_filter}
            handleCategoryInput={handleCategoryInput}
            price_filter={price_filter}
            size_filter={size_filter}
            floors_filter={floors_filter}
            cfields={cfields}
            i18n={i18n}
          />

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
                            text: 'Τιμή αύξουσα',
                            sort_filter: 'price',
                            sort_order: 'asc',
                            icon: 'fas fa-coins fa-fw',
                          },
                          {
                            sn: 0,
                            text: 'Τιμή φθίνουσα',
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
                      i18n={i18n}
                      showControls={showControls}
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
