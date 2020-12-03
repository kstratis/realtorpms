import React, { useState, useRef, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Spinner from '../datatables/Spinner';

function ListPicker({
  data,
  handlePageClick,
  handleAssignProperty,
  calculatePageCount,
  isLoading,
  searchInput,
  setSearchInput,
  i18n,
}) {
  const [ready, setReady] = useState(false);

  // This useEffect allows us to smoothly use pagination without 'no content' flashing except the very first time
  // the modal launches. It's mainly a trick. Think about its flow and it will make total sense.
  useEffect(() => {
    if (!isLoading && !ready) {
      setReady(true);
    }
  }, [isLoading, ready, setReady]);

  return (
    <>
      <Spinner isLoading={isLoading} />
      <div className={`input-group mb-4`}>
        <label className="input-group-prepend" htmlFor="search">
          <span className="input-group-text">
            <i className={'fas fa-search'} />
          </span>
        </label>
        <div className={'clearfix'} />
        <input
          type="text"
          className="form-control theme-form-control"
          aria-describedby="Inline Search"
          aria-label="Inline Search"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder={i18n.modal.search_placeholder}
        />
      </div>
      {!ready ? (
        ''
      ) : (
        <div>
          <div className={'row'}>
            <div className="col-12">
              <div className={`list-group list-group-bordered mb-3 ${isLoading ? 'reduced-opacity' : ''}`}>
                {data['payload'].length > 0 ? (
                  data['payload'].map(entry => (
                    <div key={entry['id']} className={'d-flex'}>
                      <div
                        className={`flex-fill custom-list-group-item list-group-item list-group-item-action list-group-item-${
                          entry['already_assigned_to_user'] ? 'success' : 'danger'
                        }`}
                        key={entry['id']}
                        onClick={e => null}>
                        {entry['label']}
                      </div>
                      <div className={'custom-list-button'}>
                        <a
                          data-toggle="tooltip"
                          data-placement="auto"
                          onClick={e => handleAssignProperty(e, entry['id'], data['extra']['current_page'])}
                          className={`btn btn-md btn-icon btn-secondary btn-action toggle ${
                            entry['already_assigned_to_user'] ? 'active' : ''
                          }`}
                          href={''}>
                          <i className={`fas fa-check `} />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`no-entries reduced-opacity`}>
                    <i className="no-results-alt"> </i>
                    <h3>{i18n['no_results']}</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={'row d-flex justify-content-center'}>
            {data['payload'].length > 0 ?
            <nav aria-label="Results navigation">
              <ReactPaginate
                previousLabel={'❮'}
                nextLabel={'❯'}
                breakClassName={'break-button break-button-upper'}
                pageCount={calculatePageCount(data['extra']['total_entries'], data['extra']['results_per_page'])}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                pageLinkClassName={'page-link'}
                activeClassName={'active'}
                forcePage={data['extra']['current_page'] - 1}
                pageClassName={'page-item page-item-upper'}
                previousLinkClassName={'page-link'}
                nextLinkClassName={'page-link'}
                nextClassName={'next'}
                previousClassName={'previous'}
              />
            </nav> : <h3>{i18n.modal.no_results}</h3>}
          </div>
        </div>
      )}
    </>
  );
}

export default ListPicker;
