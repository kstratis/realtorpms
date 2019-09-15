import SortFilter from './SortFilter';
import Spinner from './Spinner';
import FlipMove from 'react-flip-move';
import { renderHTML } from '../utilities/helpers';
import ClampWrapper from '../components/ClampWrapper';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import withDatatable from './withDatatable';
import React from 'react';

const ClientPrefsList = ({
  handleLocationInput,
  handlePriceInput,
  handleSizeInput,
  handleRoomsInput,
  handleFloorsInput,
  handleConstructionInput,
  handleChangePurpose,
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
  properties_path,
  i18n
}) => {
  return (
    <div className="properties-list">
      <div className={'PropertyListContainer'}>
        <div className={'row'}>
          <div className={'col-12'}>
            {/* Generate the needed filters according to the i18n keys of the erb template */}
            {/*<div className={'row mb-3 px-2 d-flex flex-nowrap'}>*/}
            {/*  <div className={'text-center'}>*/}
                {/*<SortFilter*/}
                {/*  handleFn={handleSort}*/}
                {/*  slug={'created_at'}*/}
                {/*  title={i18n.filters.sortByDate.title}*/}
                {/*  currentSorting={sorting}*/}
                {/*  currentOrdering={ordering}*/}
                {/*  options={[*/}
                {/*    {*/}
                {/*      sn: 0,*/}
                {/*      text: i18n.filters.sortByDate.option1,*/}
                {/*      sort_filter: 'created_at',*/}
                {/*      sort_order: 'desc',*/}
                {/*      icon: 'fas fa-sort-amount-up fa-fw'*/}
                {/*    },*/}
                {/*    {*/}
                {/*      sn: 1,*/}
                {/*      text: i18n.filters.sortByDate.option2,*/}
                {/*      sort_filter: 'created_at',*/}
                {/*      sort_order: 'asc',*/}
                {/*      icon: 'fas fa-sort-amount-down fa-fw'*/}
                {/*    }*/}
                {/*  ]}*/}
                {/*/>*/}
              {/*</div>*/}
            {/*</div>*/}
            <Spinner isLoading={isLoading} version={2} />
            {dataset.length > 0 ? (
              <div className={`${isLoading ? 'reduced-opacity' : ''}`}>
                <FlipMove>
                  {dataset.map((entry, index) => (
                    <div key={entry.slug}>
                      <div className={'row'}>
                        <div className="col-12">
                          <div className="list-group list-group-media mb-3">
                            <a
                              href={entry['allow_view'] ? entry['view_entity_path'] : ''}
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
                                  {!entry['allow_view'] ? (
                                    <div className={'col-12'}>
                                      <div>
                                        <h2>{entry['slug'].toUpperCase()}</h2>
                                      </div>
                                      <div>
                                        <h3>{entry['access_msg']}</h3>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className={'col-8'}>
                                        {/*<h4 className="list-group-item-title">{entry.mini_heading}</h4>*/}
                                        <h4 className="list-group-item-title">{renderHTML(entry.mini_heading)}</h4>
                                        <p className="">{entry.location}</p>
                                        <p className="list-group-item-text clamp-3">{entry.description}</p>
                                      </div>
                                      <div className={'col-4'}>
                                        <p className="list-group-item-text purpose">{entry.purpose}</p>
                                        <p className="list-group-item-text text-right mt-2">{entry.price}</p>
                                        {/*<p className="list-group-item-text text-right">{entry.size}</p>*/}
                                        <div className="list-group-item-text text-right">{renderHTML(entry.size)}</div>
                                        <div className="list-group-item-text text-right">
                                          {renderHTML(entry.pricepersqmeter)}
                                        </div>

                                        <p className="list-group-item-text text-right uid text-center">
                                          <strong>{entry['slug'].toUpperCase()}</strong>
                                        </p>
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

ClientPrefsList.propTypes = {
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

const ClientPrefsListWithDatatable = withDatatable(ClientPrefsList);

export default ClientPrefsListWithDatatable;
