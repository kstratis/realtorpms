import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';
import SkyLight from 'react-skylight';

const PropertiesList = ({handlePageClick, handleSort, handleAssign, advanceByTwo, isLoading, dataset, pageCount, selectedPage, sorting, ordering}) => {
  return (

    <div className="dataTablePage col-md-12">
      <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title="Hi, I'm a simple modal">
        Hello, I dont have any callback.
      </SkyLight>
      {/* CARD START */}
      {isLoading
        ? <div className={'centered'}>
            <div className={'spinner'}/>
          </div>
        : dataset.length > 0
          ? <div className={'PropertyListContainer'}>
            <div>
              {dataset.map((entry) => (
                <div className={'col-lg-3 col-md-4 col-xs-6 property-container'} key={entry.id}>
                  <div className={'property'}>
                    <div><a href={entry['view_entity_path']}>{entry['description']}</a></div>
                    <div>{entry['size']}</div>
                    <div>{entry['price']}</div>
                    <div>{'hello world'}</div>
                    <div className={'col-md-12 col-sm-12 col-xs-12 card-controls-container'}>
                      <div className="btn-group btn-group-sm card-controls" role="group" aria-label="...">
                        <a className={'card-control-button btn btn-default'} onClick={() => this.simpleDialog.show()} role={'group'}><span><i className={'fa fa-eye fa-lg fa-fw '}></i></span></a>
                        <a className={'card-control-button btn btn-default'} role={'group'}><span><i className={'fa fa-pencil fa-lg fa-fw'}></i></span></a>
                        <a className={'card-control-button btn btn-default'} role={'group'}><span><i className={'fa fa-trash fa-lg fa-fw'}></i></span></a>
                      </div>
                    </div>
                  </div>



                </div>
              ))}
            </div>
             {/* CARD END */}
            <div className={'clearfix'}> </div>

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
            <h3>No properties available.</h3>
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

const PropertiesListWithDatatable = withDatatable(PropertiesList);

export default PropertiesListWithDatatable;
