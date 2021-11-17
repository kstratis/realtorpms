import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import ReactPaginate from 'react-paginate';
import withDatatable from './withDatatable';
import Spinner from './Spinner';
import useTooltips from '../hooks/useTooltips';
import useMultiCheckbox from '../hooks/useMultiCheckbox';
import ModalControlStrip from '../components/modals/ModalControlStrip';
import ModalPortalWrapper from '../components/modals/ModalPortalWrapper';
import { renderHTML } from "../utilities/helpers";

// Imperative code. Given as callback after a notification is read.
// Updates the unread notifications counter on the header.
const updateUnreadNotificationsCount = (count) => {
  const $unread_notifications_count = $('#unread-notifications-count');
  $unread_notifications_count.text(count);

  if (count === 0){
    $unread_notifications_count.hide();
  }
}

const NotificationsList = ({
  handlePageClick,
  handleReadNotification,
  advanceByTwo,
  isLoading,
  dataset,
  pageCount,
  selectedPage,
  i18n,
  meta,
}) => {
  const [notification, setNotification] = useState({});
  const firstPageLoad = useRef(true);

  // Mass delete functionality
  const { checkedItems, masterCheck, checkAll, handleCheckboxChange } = useMultiCheckbox(
    dataset.map(entry => entry.id),
    selectedPage
  );

  // Read notification functionality
  useEffect(() => {
    // Don't do anything on page load
    if (firstPageLoad.current) {
      firstPageLoad.current = false;
      return;
    }
    // Post to backend and refresh table
    handleReadNotification(notification.read_path, updateUnreadNotificationsCount);
    // Show the notification
    $('#appModalView').modal('toggle');
  }, [notification]);

  const showMessage = (e, id, message, read_path) => {
    e.preventDefault();
    setNotification({ id: id, message: message, read_path: read_path });
  };

  useTooltips();

  return (
    <div className="notifications-list">
      <ModalPortalWrapper>
        <div
          className="modal fade"
          id="appModalView"
          role="dialog"
          aria-labelledby="appModalViewLabel"
          aria-hidden="true">
          <div className={`modal-dialog md modal-dialog-centered`} role="document">
            <div className={`modal-content`}>
              <div className="modal-header">
                <h5 id={`titlemo`} className="modal-title">
                  <i className={'fas fa-envelope fa-fw'} />
                </h5>
              </div>
              <div className={`modal-body modal-wrapper`}>{renderHTML(notification.message, 'span')}</div>
              <div className="modal-footer modal-footer-border">
                <button type="button" className="btn btn-outline-secondary" data-dismiss="modal">
                  {i18n.modal.mass_actions.close_btn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ModalPortalWrapper>

      <Spinner isLoading={isLoading} />
      <div className={'NotificationsListContainer'}>
        <div className={'row'}>
          <div className={`d-block col-xl-12`}>
            <div className={'card'}>
              <div className={'card-body'}>
                <div className={'row'}>
                  <div className={'mb-3 custom-px d-flex flex-fill flex-nowrap'}>
                    <div className={'btn-group btn-group-toggle pl-2'}>
                      <ModalControlStrip
                        entries={[
                          {
                            name: 'MassActions',
                            button: {
                              content: `<i class='fas fa-tasks fa-lg fa-fw'/>`,
                              size: 'md',
                              classname: 'btn-success',
                              tooltip: i18n.button.tooltip,
                              isDisabled: !Object.keys(checkedItems).some(i => checkedItems[i]),
                            },
                            modal: {
                              id: 'client-list-modal',
                              i18n: i18n,
                              title: i18n.modal.mass_actions.title,
                              buttonCloseLabel: i18n.modal.mass_actions.close_btn,
                              origin: 'menu',
                              checkedItems: checkedItems,
                              massDeletePersonsEndpoint: meta.mass_delete_notifications_link,
                              massFreezePersonsEndpoint: '',
                            },
                          },
                        ]}
                      />
                      {Object.keys(checkedItems).filter(i => checkedItems[i]).length ? (
                        <div className={'d-flex align-items-center justify-content-center user-assign-counter'}>
                          <strong>{Object.keys(checkedItems).filter(i => checkedItems[i]).length}</strong>
                        </div>
                      ) : null}
                    </div>

                    {/* Placeholder for proper alignment */}
                    <div className={'flex-grow-1'}/>

                    <div>
                      <div className={'d-none d-sm-block'}>
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
                            pageLinkClassName={'page-link'}
                            activeClassName={'active'}
                            forcePage={selectedPage}
                            pageClassName={'page-item page-item-upper'}
                            previousLinkClassName={'page-link'}
                            nextLinkClassName={'page-link'}
                            nextClassName={'next'}
                            previousClassName={'previous'}
                          />
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*  GOOD */}
              {dataset.length > 0 ? (
                <div>
                  <div className={'table-responsive'}>
                    <table id="usersTable" className={`table table-striped ${isLoading ? 'reduced-opacity' : ''}`}>
                      <thead>
                        <tr>
                          <th>
                            <div className="custom-control custom-checkbox d-inline-block">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                name={'master-check-clients'}
                                id={'master-check-clients'}
                                checked={!!masterCheck[selectedPage + 1]}
                                onChange={() => checkAll()}
                              />
                              <label className="custom-control-label" htmlFor={'master-check-clients'} />
                            </div>
                            <span>{i18n['datatable']['message']}</span>
                          </th>
                          <th className={'text-nowrap'}>{i18n['datatable']['status']['title']}</th>
                          <th className={'text-nowrap'}>{i18n['datatable']['date']}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataset.map(entry => (
                          <tr className={'entry'} key={entry['id']}>
                            <td className={'align-middle text-nowrap'}>
                              <div className={'table-entry'}>
                                <div className="custom-control custom-checkbox d-inline-block">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    name={entry['id']}
                                    id={entry['id']}
                                    checked={!!checkedItems[entry['id']]}
                                    onChange={handleCheckboxChange}
                                  />
                                  <label className="custom-control-label" htmlFor={entry['id']} />
                                </div>
                                <a
                                  className={'table-entry cursor-pointer '}
                                  href={''}
                                  onClick={e => showMessage(e, entry['id'], entry['message'], entry['read_path'])}>
                                  {entry['read_at'] ? (
                                    renderHTML(entry['message'], 'span')
                                  ) : (
                                    <strong>
                                      {renderHTML(entry['message'], 'span')}
                                    </strong>
                                  )}
                                </a>
                              </div>
                            </td>
                            <td className={'align-middle text-nowrap'}>
                              <div className={'table-entry pointer-questionmark'}>
                                <span
                                  data-toggle="tooltip"
                                  data-position="top"
                                  title={
                                    entry['read_at']
                                      ? i18n['datatable']['status']['read']
                                      : i18n['datatable']['status']['unread']
                                  }>
                                  <i
                                    className={`${entry['read_at'] ? 'far fa-envelope-open green' : 'fas fa-envelope'} fa-lg fa-fw`}
                                  />
                                </span>
                              </div>
                            </td>
                            <td className={'align-middle'}>
                              <div className={'table-entry'}>
                                <span>{entry['created_at']}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={'clearfix'} />
                  <div className={'d-none d-md-block'}>
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
                  </div>
                  <div>
                    <div className={'d-xs-block d-sm-block d-md-none'}>
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
                            breakClassName={'break-button break-button-upper'}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            pageLinkClassName={'page-link'}
                            activeClassName={'active'}
                            forcePage={selectedPage}
                            pageClassName={'page-item page-item-upper'}
                            previousLinkClassName={'page-link'}
                            nextLinkClassName={'page-link'}
                            nextClassName={'next'}
                            previousClassName={'previous'}
                          />
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`no-entries ${isLoading ? 'reduced-opacity' : ''}`}>
                  <i className="no-results-notifications"> </i>
                  <h3>{i18n['no_results']}</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

NotificationsList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  dataset: PropTypes.array.isRequired,
  advanceByTwo: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  handlePageClick: PropTypes.func.isRequired,
  selectedPage: PropTypes.number.isRequired,
};

const NotificationsListWithDatatable = withDatatable(NotificationsList);

export default NotificationsListWithDatatable;
