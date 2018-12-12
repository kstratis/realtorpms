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
  ordering
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
                  <img className="card-img-top" src="https://picsum.photos/200/200/?random" alt="Card image cap" />
                  <div className="card-body">
                    <h5 className="card-title clamp-2">{entry.title}</h5>
                    <p className="card-text clamp-2">{entry.description}</p>
                    <a href="#" className="btn btn-secondary">
                      Go somewhere
                    </a>
                  </div>
                  <div className="card-footer">
                    <small className="text-muted">{'Last updated 3 mins ago'}</small>
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
