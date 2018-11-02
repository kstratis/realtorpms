import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';
import SkyLight from 'react-skylight';

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
    <div className="col-md-12">
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
          <div className={'row'}>
            {dataset.map(entry => (
              <div className={'col-sm-3'}>
                <div className="card card-container" key={entry.id}>
                  <img className="card-img-top card-image" src="https://via.placeholder.com/250x200" alt="Card image cap" />
                  <div className="card-body">
                    <h5 className="card-title">{entry.title}</h5>
                    <p className="card-text">{entry.description}</p>
                    <a href="#" className="btn btn-primary">
                      Go somewhere
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* CARD END */}
          {/*<div className={'clearfix'}> </div>*/}
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
