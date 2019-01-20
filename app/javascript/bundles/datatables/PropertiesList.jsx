import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';
import Highlighter from 'react-highlight-words';
import withDatatable from './withDatatable';
import SkyLight from 'react-skylight';
import Search from './Search';
import ClampWrapper from '../components/ClampWrapper';
import Image from 'react-graceful-image';
import ControlsContainer from './ControlsContainer';
import SortFilter from './SortFilter';

const PropertiesList = ({
  handlePageClick,
  handleSort,
  handleAssign,
  handleFav,
  advanceByTwo,
  isLoading,
  dataset,
  pageCount,
  selectedPage,
  sorting,
  ordering,
  searchInput,
  handleSearchInput,
  i18n
}) => {
  return (
    <div className="">
      <div className={'container'}>
        <div className={'row'}>
          <Search handleSearchInput={handleSearchInput} searchInput={searchInput} placeholder={i18n['search']} />
          {/* Generate the needed filters according to the i18n keys of the erb template */}
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

          {/*<ControlsContainer*/}
          {/*i18n={i18n}*/}
          {/*filters={Object.keys(i18n.filters).map((filter)=> {*/}
          {/*return {'name': i18n.filters[filter].title, 'fn': handleSort, 'i18n': i18n.filters[filter] }*/}
          {/*})}*/}
          {/*/>*/}
        </div>
      </div>

      {/* CARD START */}
      {isLoading ? (
        <div className={'centered'}>
          <div className={'spinner'} />
        </div>
      ) : dataset.length > 0 ? (
        <div className={'PropertyListContainer'}>
          <div className={'card-deck'}>
            {dataset.map((entry, index) => (
              <div className={'col-sm-6 col-lg-4'} key={entry.id}>
                {console.log(entry)}
                <div className="card mb-4 mt-2">
                  <Image
                    // id={'yyy'}
                    src={`https://picsum.photos/640/480/?random&sig=${Math.random()}`}
                    className={'card-img-top thumb'}
                    // width="300"
                    // height={`${document.getElementById('yyy').clientHeight}px`}
                    // height={`${this.clientHeight}`}
                    height={'209px'}
                    alt="My awesome image"
                    placeholderColor={'#4dabf5'}
                  />
                  {/*<img*/}
                  {/*className="card-img-top thumb"*/}
                  {/*src={`https://picsum.photos/640/480/?random&sig=${Math.random()}`}*/}
                  {/*alt="Card image cap"*/}
                  {/*/>*/}
                  {/*<img className="card-img-top thumb" src={"https://picsum.photos/1250/800?image=1"} alt="Card image cap" />*/}
                  <div className="card-body">
                    <h5 className="card-title clamp-2">
                      <Highlighter
                        highlightClassName="highlighted"
                        searchWords={[searchInput]}
                        autoEscape={true}
                        textToHighlight={entry['title']}
                      />
                    </h5>
                    <div className={'desc-container'}>
                      <p className="card-text clamp-2">
                        <Highlighter
                          highlightClassName="highlighted"
                          searchWords={[searchInput]}
                          autoEscape={true}
                          textToHighlight={entry['description']}
                        />
                      </p>
                    </div>
                  </div>
                  <div className={'favourites'}>
                    <a
                      title={i18n.favourites_tooltip}
                      data-toggle="tooltip"
                      data-placement="top"
                      onClick={e => handleFav(e, entry.fav_entity_path, entry.isFaved, entry.id)}
                      className={'tooltips btn-circle'}
                      href={'#'}>
                      {entry.isFaved ? (
                        <i className="fas fa-heart fa-lg fa-fw colored" />
                      ) : (
                        <i className={'far fa-heart fa-lg fa-fw'} />
                      )}
                    </a>
                  </div>
                  <div className={"property-owner-name"}>
                    <Highlighter
                      highlightClassName="highlighted"
                      searchWords={[searchInput]}
                      autoEscape={true}
                      textToHighlight={entry['owner_name']}
                    />
                  </div>
                  <div className={"property-owner-tel"}><Highlighter
                    highlightClassName="highlighted"
                    searchWords={[searchInput]}
                    autoEscape={true}
                    textToHighlight={entry['owner_tel']}
                  /></div>

                  <div className="card-control-buttons btn-group d-flex" role="group" aria-label="Basic example">
                    <a
                      href={entry.view_entity_path}
                      title={i18n.view}
                      className="btn btn-primary tooltips w-100"
                      data-toggle="tooltip"
                      data-placement="top">
                      <i className={'fas fa-eye fa-fw'} />
                      &nbsp;
                    </a>
                    <a
                      href={entry.edit_entity_path}
                      title={i18n.edit}
                      className="btn btn-warning tooltips w-100"
                      data-toggle="tooltip"
                      data-placement="top">
                      <i className={'fas fa-pen fa-fw'} />
                      &nbsp;
                    </a>
                  </div>
                </div>
              </div>
            ))}
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
          <ClampWrapper />
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
