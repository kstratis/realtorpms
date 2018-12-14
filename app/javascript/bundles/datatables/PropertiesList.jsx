import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';
import SkyLight from 'react-skylight';
import ClampWrapper from '../components/ClampWrapper';

const PropertiesList = ({
  handlePageClick,
  handleSort,
  handleAssign,
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
          <div className={'spinner'} />
        </div>
      ) : dataset.length > 0 ? (
        <div className={'PropertyListContainer'}>
          <div className={'card-deck'}>
            {dataset.map((entry, index) => (
              <div className={'col-sm-6 col-lg-4'} key={entry.id}>
                <div className="card mb-4 mt-2">
                  <img
                    className="card-img-top thumb"
                    src={`https://picsum.photos/640/480/?random&sig=${Math.random()}`}
                    alt="Card image cap"
                  />
                  {/*<img className="card-img-top thumb" src={"https://picsum.photos/1250/800?image=1"} alt="Card image cap" />*/}
                  <div className="card-body">
                    <h5 className="card-title clamp-2">{entry.title}</h5>
                    <div className={'desc-container'}>
                      <p className="card-text clamp-2">{entry.description}</p>
                    </div>

                  </div>
                  <div className="btn-group d-flex" role="group" aria-label="Basic example">
                    <a href="#" className="btn btn-primary w-100">{i18n.view}</a>
                    {/*<a href="#" className="btn btn-danger"><i className="fa fa-eye fa-fw"/></a>*/}
                    <a href="#" className="btn btn-warning w-100">{i18n.edit}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* CARD END */}
          <div className={'clearfix'}> </div>
          <div className={'row'}>
            <ReactPaginate
              previousLabel={'❮'}
              nextLabel={'❯'}
              breakLabel={
                <span className="break-button-content" onClick={advanceByTwo}>
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
              activeClassName={'active'}
              forcePage={selectedPage}
              pageClassName={'page'}
              nextClassName={'next'}
              previousClassName={'previous'}
            />
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
