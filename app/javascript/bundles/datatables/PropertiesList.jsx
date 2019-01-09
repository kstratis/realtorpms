import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';
import SkyLight from 'react-skylight';
import ClampWrapper from '../components/ClampWrapper';
import Image from 'react-graceful-image';

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
                          i18n
                        }) => {
  return (
    <div className="">
      <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialog = ref)} title="Hi, I'm a simple modal">
        Hello, I dont have any callbacks.
      </SkyLight>
      {/* CARD START */}
      {isLoading ? (
        <div className={'centered'}>
          <div className={'spinner'}/>
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
                    <h5 className="card-title clamp-2">{entry.title}</h5>
                    <div className={'desc-container'}>
                      <p className="card-text clamp-2">{entry.description}</p>
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
                      {entry.isFaved ? <i className="fas fa-heart fa-lg fa-fw"/> :
                        <i className={'far fa-heart fa-lg fa-fw'}/>}
                    </a>
                  </div>
                  <div className="card-control-buttons btn-group d-flex" role="group" aria-label="Basic example">
                    <a
                      href={entry.view_entity_path}
                      title={i18n.view}
                      className="btn btn-primary tooltips w-100"
                      data-toggle="tooltip"
                      data-placement="top">
                      <i className={'fas fa-eye fa-fw'}/>
                      &nbsp;
                    </a>
                    <a
                      href={entry.edit_entity_path}
                      title={i18n.edit}
                      className="btn btn-warning tooltips w-100"
                      data-toggle="tooltip"
                      data-placement="top">
                      <i className={'fas fa-pen fa-fw'}/>
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
          <ClampWrapper/>
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
