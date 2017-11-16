import PropTypes from 'prop-types';
import React from 'react';
import UserEntry from './UserEntry';
import withDatatable from './withDatatable';
// noinspection NpmUsedModulesInstalled;
// import spinner_URL from 'images/spinners/double_ring.svg';
import ReactPaginate from 'react-paginate';

const UsersList = ( { handlePageClick, handleSort, handleAssign, advanceByTwo, isLoading, dataset, pageCount, selectedPage, sorting, ordering }) => {

  return (

    <div className="dataTablePage col-md-12">
      {isLoading
        ? <div className={'centered'}><div className={'spinner'} /></div>
        // ? <div className={'centered'}><img src={spinner_URL} /></div>
        : dataset.length > 0
          ? <div className={'dataTableContainer'}>
            <table id="usersTable" className="table table-striped pr-table dataTable">
              <thead>
              <tr>
                <th>
                  <a className={'sortable-header-name'} href={''} onClick={(e) => handleSort(e, 'last_name')}>
                    <span>User</span>
                    {sorting === 'last_name'
                      ? ordering === 'asc'
                        ? <span className={'sortable-icon-container'}>
                                <i title='Ascending order' className="fa fa-chevron-up fa-lg fa-fw pull-right" aria-hidden="true"> </i>
                              </span>
                        : <span className={'sortable-icon-container'}>
                                <i title='Descending order' className="fa fa-chevron-down fa-lg fa-fw pull-right" aria-hidden="true"> </i>
                              </span>
                      : ''
                    }
                  </a>
                </th>
                <th>
                  <a className={'sortable-header-name'} href={''} onClick={(e) => handleSort(e, 'email')}>
                    <span>Email</span>
                    {sorting === 'email'
                      ? ordering === 'asc'
                        ? <span className={'sortable-icon-container'}>
                                <i title='Ascending order' className="fa fa-chevron-circle-up fa-lg fa-fw pull-right" aria-hidden="true"> </i>
                              </span>
                        : <span className={'sortable-icon-container'}>
                                <i title='Descending order' className="fa fa-chevron-circle-down fa-lg fa-fw pull-right" aria-hidden="true"> </i>
                              </span>
                      : ''
                    }
                  </a>
                </th>
                <th><span>User Type</span></th>
                {/*<th><span>Assignments</span></th>*/}
                <th>
                  <a className={'sortable-header-name'} href={''} onClick={(e) => handleSort(e, 'created_at')}>
                    <span>Registration</span>
                    {sorting === 'created_at'
                      ? ordering === 'asc'
                        ? <span className={'sortable-icon-container'}>
                                <i title='Ascending order' className="fa fa-chevron-circle-up fa-lg fa-fw pull-right" aria-hidden="true"> </i>
                              </span>
                        : <span className={'sortable-icon-container'}>
                                <i title='Descending order' className="fa fa-chevron-circle-down fa-lg fa-fw pull-right" aria-hidden="true"> </i>
                              </span>
                      : ''
                    }
                  </a>
                </th>
                <th><span>Quick Actions</span></th>
              </tr>
              </thead>
              <tbody>
              {dataset.map((entry) => (
                <UserEntry key={entry['id']} entry={entry} handleAssign={handleAssign} />
              ))}
              </tbody>
            </table>
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
                           previousClassName={'previous'} />
          </div>
          : <div className={"no-users"}>
            <i className="pr-icon lg no-results"> </i>
            <h3>No users found.</h3>
          </div>
      }
    </div>
  );
};




// class UsersList extends React.Component {
//   constructor(props) {
//     super(props);
//     let { isLoading, dataset, advanceByTwo, pageCount, handlePageClick, selectedPage, handleSort, sorting, ordering, handleAssign } = props;
//   }

  // componentDidMount() {
    // Subscribe to changes
    // DataSource.addChangeListener(this.handleChange);
  // }

  // componentWillUnmount() {
    // Clean up listener
    // DataSource.removeChangeListener(this.handleChange);
  // }


//   render() {
//     return (
//       <div className="dataTablePage col-md-12">
//         {isLoading
//           ? <div className={'centered'}><div className={'spinner'} /></div>
//           // ? <div className={'centered'}><img src={spinner_URL} /></div>
//           : dataset.length > 0
//             ? <div className={'dataTableContainer'}>
//               <table id="usersTable" className="table table-striped pr-table dataTable">
//                 <thead>
//                 <tr>
//                   <th>
//                     <a className={'sortable-header-name'} href={''} onClick={(e) => handleSort(e, 'last_name')}>
//                       <span>User</span>
//                       {sorting === 'last_name'
//                         ? ordering === 'asc'
//                           ? <span className={'sortable-icon-container'}>
//                                 <i title='Ascending order' className="fa fa-chevron-up fa-lg fa-fw pull-right" aria-hidden="true"> </i>
//                               </span>
//                           : <span className={'sortable-icon-container'}>
//                                 <i title='Descending order' className="fa fa-chevron-down fa-lg fa-fw pull-right" aria-hidden="true"> </i>
//                               </span>
//                         : ''
//                       }
//                     </a>
//                   </th>
//                   <th>
//                     <a className={'sortable-header-name'} href={''} onClick={(e) => handleSort(e, 'email')}>
//                       <span>Email</span>
//                       {sorting === 'email'
//                         ? ordering === 'asc'
//                           ? <span className={'sortable-icon-container'}>
//                                 <i title='Ascending order' className="fa fa-chevron-circle-up fa-lg fa-fw pull-right" aria-hidden="true"> </i>
//                               </span>
//                           : <span className={'sortable-icon-container'}>
//                                 <i title='Descending order' className="fa fa-chevron-circle-down fa-lg fa-fw pull-right" aria-hidden="true"> </i>
//                               </span>
//                         : ''
//                       }
//                     </a>
//                   </th>
//                   <th><span>User Type</span></th>
//                   {/*<th><span>Assignments</span></th>*/}
//                   <th>
//                     <a className={'sortable-header-name'} href={''} onClick={(e) => handleSort(e, 'created_at')}>
//                       <span>Registration</span>
//                       {sorting === 'created_at'
//                         ? ordering === 'asc'
//                           ? <span className={'sortable-icon-container'}>
//                                 <i title='Ascending order' className="fa fa-chevron-circle-up fa-lg fa-fw pull-right" aria-hidden="true"> </i>
//                               </span>
//                           : <span className={'sortable-icon-container'}>
//                                 <i title='Descending order' className="fa fa-chevron-circle-down fa-lg fa-fw pull-right" aria-hidden="true"> </i>
//                               </span>
//                         : ''
//                       }
//                     </a>
//                   </th>
//                   <th><span>Quick Actions</span></th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {dataset.map((entry) => (
//                   <UserEntry key={entry['id']} entry={entry} handleAssign={handleAssign} />
//                 ))}
//                 </tbody>
//               </table>
//               <ReactPaginate previousLabel={"❮"}
//                              nextLabel={"❯"}
//                              breakLabel={
//                                <span className="break-button-content"
//                                      onClick={advanceByTwo}>...</span>}
//                              breakClassName={"break-button"}
//                              pageCount={pageCount}
//                              marginPagesDisplayed={2}
//                              pageRangeDisplayed={5}
//                              onPageChange={handlePageClick}
//                              containerClassName={"pagination"}
//                              subContainerClassName={"pages pagination"}
//                              activeClassName={"active"}
//                              forcePage={selectedPage}
//                              pageClassName={"page"}
//                              nextClassName={'next'}
//                              previousClassName={'previous'} />
//             </div>
//             : <div className={"no-users"}>
//               <i className="pr-icon lg no-results"> </i>
//               <h3>No users found.</h3>
//             </div>
//         }
//       </div>
//
//     );
//   }
// }











UsersList.propTypes = {
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

const UsersListWithDatatable = withDatatable(UsersList);

export default UsersListWithDatatable;


