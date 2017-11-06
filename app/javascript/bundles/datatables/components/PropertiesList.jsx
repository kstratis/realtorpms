import PropTypes from 'prop-types';
import React from 'react';
// noinspection NpmUsedModulesInstalled;
// import spinner_URL from 'images/spinners/double_ring.svg';
import ReactPaginate from 'react-paginate';

const PropertiesList = ({isLoading, dataset, advanceByTwo, pageCount, handlePageClick, selectedPage, handleSort, sorting, ordering}) => {

  return (

    <div className="dataTablePage col-md-12">
      {isLoading
        ? <div className={'centered'}>
          <div className={'spinner'}/>
        </div>
        // ? <div className={'centered'}><img src={spinner_URL} /></div>
        : dataset.length > 0
          ? <div className={'PropertyListContainer'}>
            <div>
              {dataset.map((entry) => (
                <div className={'col-lg-3 col-md-4 col-xs-6 property-container'} key={entry.id}>
                  <div className={'property'}>
                  <div>{entry['description']}</div>
                  <div>{entry['size']}</div>
                  <div>{entry['price']}</div>
                  </div>



                </div>
              ))}
            </div>
            <div className={'clearfix'}></div>
            <ReactPaginate previousLabel={"❮"}
                           nextLabel={"❯"}
                           breakLabel={
                             <span className="break-button-content"
                                   onClick={advanceByTwo}>...</span>}
                           breakClassName={"break-button"}
                           pageCount={pageCount}
                           marginPagesDisplayed={2}
                           pageRangeDisplayed={5}
                           onPageChange={handlePageClick}
                           containerClassName={"pagination"}
                           subContainerClassName={"pages pagination"}
                           activeClassName={"active"}
                           forcePage={selectedPage}
                           pageClassName={"page"}
                           nextClassName={'next'}
                           previousClassName={'previous'}/>
          </div>
          : <div className={"no-users"}>
            <i className="pr-icon lg no-results"> </i>
            <h3>No users found.</h3>
          </div>
      }
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

export default PropertiesList;


