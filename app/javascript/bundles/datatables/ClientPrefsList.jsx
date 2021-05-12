import Spinner from './Spinner';
import ClampWrapper from '../components/ClampWrapper';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import withDatatable from './withDatatable';
import React from 'react';
import PropertyEntry from './PropertyEntry';

const ClientPrefsList = ({ handlePageClick, advanceByTwo, isLoading, dataset, pageCount, selectedPage, i18n }) => {
  return (
    <div className="client-prefs-list">
      <div className={'ClientPrefsListContainer'}>
        <div className={'row'}>
          <div className={'col-12'}>
            <Spinner isLoading={isLoading} version={2} />
            {dataset.length > 0 ? (
              <>
                <div className={`row relativeposition ${isLoading ? 'reduced-opacity' : ''}`}>
                  {dataset.map((entry, index) => (
                    <PropertyEntry key={entry.slug} entry={entry} filtersOpen={false} i18n={i18n} />
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
