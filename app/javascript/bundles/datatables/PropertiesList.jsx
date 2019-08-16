import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';
import ClampWrapper from '../components/ClampWrapper';
import SortFilter from './SortFilter';
import AsyncSelect from '../components/selects/AsyncSelect';
import FlipMove from 'react-flip-move';
import PlainSelect from '../components/selects/PlainSelect';
import NestedFormSelect from '../components/selects/NestedFormSelect';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

const PropertiesList = ({
  handleLocationInput,
  handleChangePurpose,
  handlePageClick,
  handleSort,
  buysell_filter,
  category_filter,
  handleAssign,
  handleFav,
  advanceByTwo,
  isLoading,
  selectedPurpose,
  dataset,
  pageCount,
  selectedPage,
  sorting,
  ordering,
  searchInput,
  handleSearchInput,
  handleCategoryInput,
  locations_endpoint,
  i18n
}) => {
  return (
    <div className="">
      {/* CARD START */}
      {isLoading ? (
        <div className={'centered'}>
          <div className={'spinner'} />
        </div>
      ) : null}
      {dataset.length > 0 ? (
        <div className={'PropertyListContainer'}>
          <div className={'row'}>
            <div className={'filters col-4'}>
              <div className="card">
                <div className="card-header">
                  <div className="table-entry">
                    <div className="table-icon-wrapper">
                      <i className="pr-icon xs filters" />
                    </div>
                    <span className="align-middle">&nbsp; {i18n.filters.title}</span>
                  </div>
                </div>
                <div className="card-body">
                  <label className="d-block">
                    <h5 className="card-title filter-header">{i18n.filters.type.title}:</h5>
                  </label>
                  <div className="form-group">
                    {buysell_filter.map(filter => (
                      <div key={filter['value']} className="custom-control custom-radio">
                        <input
                          type="radio"
                          className="custom-control-input"
                          name="rdGroup1"
                          id={filter['value']}
                          value={filter['value']}
                          onChange={e => handleChangePurpose(e)}
                          checked={selectedPurpose === filter['value']}
                        />
                        <label className="custom-control-label" htmlFor={filter['value']}>
                          {filter['label']}
                        </label>
                      </div>
                    ))}
                  </div>
                  <hr />
                  <h5 className="card-title filter-header">{i18n.select.category}:</h5>
                  <div className={'form-group'}>
                    {/*handleLocationInput*/}
                    <NestedFormSelect options={category_filter} i18n={i18n} renderFormFields={false} callback={handleCategoryInput} />
                  </div>
                </div>
              </div>
            </div>
            <div className={'col-8'}>
              {/*<Search handleSearchInput={handleSearchInput} searchInput={searchInput} placeholder={i18n['search']} />*/}

              {/* Generate the needed filters according to the i18n keys of the erb template */}
              <div className={'row mb-3'}>
                <div className={'col-8'}>
                  <AsyncSelect
                    i18n={i18n}
                    collection_endpoint={{ url: locations_endpoint, action: 'get' }}
                    action_endpoint={{ url: '', action: '', callback: handleLocationInput }}
                  />
                </div>
                <div className={'col-4'}>
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

              <FlipMove>
                {dataset.map((entry, index) => (
                  <div key={entry.id}>
                    <div className={'row'}>
                      <div className="col-12">
                        <div className="list-group list-group-media mb-3">
                          <a href={entry['view_entity_path']} className="list-group-item list-group-item-action">
                            <div className="list-group-item-figure rounded-left">
                              <div className={'thumb-container'}>
                                <img
                                  src={`https://picsum.photos/${getRandomInt(100, 800)}/${getRandomInt(
                                    100,
                                    800
                                  )}/?random&sig=${Math.random()}`}
                                  alt="placeholder image"
                                  className={'thumb'}
                                />
                              </div>
                            </div>
                            <div className="list-group-item-body">
                              <div className={'row'}>
                                <div className={'col-9'}>
                                  <h4 className="list-group-item-title">{entry.mini_heading}</h4>
                                  <p className="">{entry.location}</p>
                                  <p className="list-group-item-text">{entry.description}</p>
                                </div>
                                <div className={'col-3'}>
                                  <p className="list-group-item-text">{entry.price}</p>
                                  <p className="list-group-item-text">{entry.size}</p>
                                  <p className="list-group-item-text">{entry.pricepersqmeter}</p>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </FlipMove>
            </div>
            {/* CARD END */}
            <div className={'clearfix'} />
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
                  pageClassName={'page-item'}
                  previousLinkClassName={'page-link'}
                  nextLinkClassName={'page-link'}
                  nextClassName={'next'}
                  previousClassName={'previous'}
                />
              </nav>
            </div>
            <ClampWrapper />
          </div>
        </div>
      ) : (
        <div className={'no-users'}>
          <i className="pr-icon lg no-results"> </i>
          <h3>No properties available.</h3>
        </div>
      )}
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
