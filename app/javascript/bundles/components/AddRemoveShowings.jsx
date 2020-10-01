import React, { useState, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import useTooltips from '../hooks/useTooltips';
import FlatPickrWrapper from './FlatPickrWrapper';
import Spinner from '../datatables/Spinner';
import AsyncSelectContainer from './selects/AsyncSelectContainer';
import { renderHTML } from '../utilities/helpers';
import usePopovers from '../hooks/usePopovers';

function AddShowing({
  i18n,
  clients_url,
  partners_url,
  showings_url,
  properties_url,
  isAdmin,
  property_id,
  client_id,
  handleSetRequest,
  handleFormVisibility,
  closeMenuOnSelect,
  openMenuOnClick,
  originator
}) {
  const [client, setClient] = useState({});
  const [property, setProperty] = useState({});
  const [partner, setPartner] = useState({});
  const [date, setDate] = useState({});
  const [comments, setComments] = useState('');
  const [errormsg, setErrormsg] = useState('');

  const asyncSetClient = selection => setClient(selection);
  const asyncSetProperty = selection => setProperty(selection);
  const asyncSetPartner = selection => setPartner(selection);
  const asyncSetDate = selection => setDate(selection);
  const asyncSetComments = e => setComments(e.target.value);

  const handleAddShowing = originator => {
    let fieldsValidationArray;
    if (originator === 'property') {
      fieldsValidationArray = isAdmin ? [client, partner, date] : [client, date];
    } else {
      fieldsValidationArray = isAdmin ? [property, partner, date] : [property, date];
    }
    // DEBUG
    // console.log(client, partner, date);
    if (
      fieldsValidationArray.some(
        (element, index, array) => Object.keys(element).length === 0 && element.constructor === Object
      )
    ) {
      setErrormsg(i18n.form.warning);
      return;
    }

    handleSetRequest({
      url: showings_url,
      method: 'post',
      payload: {
        client: client,
        partner: partner,
        dateStr: date.dateStr,
        comments: comments,
        property_id: property_id,
        property: property,
        client_id: client_id,
        originator: originator
      },
      callback: response => handleFormVisibility()
    });
  };

  return (
    <div className="favlist-container mt-3">
      <h2>{i18n.form.title}</h2>
      <hr />
      <div className={'favlist-body'}>
        <div className={'col-12 col-lg-6 offset-lg-3'}>
          <span className={'d-inline-block mt-2'}>
            <label htmlFor={'AsyncSelectContainerClient'}>
              <strong>{originator === 'property' ? i18n.form.client : i18n.form.property} </strong>&nbsp;
              <abbr title={i18n.form.required}>*</abbr>
            </label>
          </span>
          {originator === 'property' ? (
            <AsyncSelectContainer
              id={'AsyncSelectContainerClient'}
              i18n={i18n}
              collection_endpoint={{ url: clients_url, action: 'get' }}
              action_endpoint={{ url: '', action: '', callback: asyncSetClient }}
              hasFeedback={false}
              isCreatable={false}
              isClearable={true}
              isMultiple={false}
              openMenuOnClick={openMenuOnClick}
            />
          ) : (
            <AsyncSelectContainer
              id={'AsyncSelectContainerProperty'}
              i18n={i18n}
              collection_endpoint={{ url: properties_url, action: 'get' }}
              action_endpoint={{ url: '', action: '', callback: asyncSetProperty }}
              hasFeedback={false}
              isCreatable={false}
              isClearable={true}
              isMultiple={false}
              openMenuOnClick={openMenuOnClick}
            />
          )}
        </div>
        {isAdmin ? (
          <div className={'col-12 col-lg-6 offset-lg-3 my-1'}>
            <span className={'d-inline-block mt-2'}>
              <label htmlFor={'AsyncSelectContainerPartner'}>
                <strong>{i18n.form.partner}</strong>&nbsp;<abbr title={i18n.form.required}>*</abbr>
              </label>
            </span>
            <AsyncSelectContainer
              id={'AsyncSelectContainerPartner'}
              i18n={i18n}
              collection_endpoint={{ url: partners_url, action: 'get' }}
              action_endpoint={{ url: '', action: '', callback: asyncSetPartner }}
              hasFeedback={false}
              isCreatable={false}
              isClearable={true}
              isMultiple={false}
              openMenuOnClick={openMenuOnClick}
              closeMenuOnSelect={closeMenuOnSelect}
            />
          </div>
        ) : null}
        <div className={'col-12 col-lg-6 offset-lg-3 my-1'}>
          <span className={'d-inline-block mt-2'}>
            <label htmlFor={'showing-date'}>
              <strong>{i18n.form.date}</strong>&nbsp;<abbr title={i18n.form.required}>*</abbr>
            </label>
          </span>
          <FlatPickrWrapper handleChange={asyncSetDate} />
          <input id={'showing-date'} className={'datetime'} />
        </div>
        <div className={'col-12 col-lg-6 offset-lg-3 my-1'}>
          <span className={'d-inline-block mt-2'}>
            <label htmlFor={'comments'}>
              <strong>{i18n.form.comments}</strong>
            </label>
          </span>
          <textarea
            id={'comments'}
            className={'form-control rows-5'}
            rows="2"
            maxLength={'512'}
            placeholder={i18n.form.comments_placeholder}
            onChange={e => asyncSetComments(e)}
          />
          <small className="form-text text-muted">{i18n.form.comments_feedback}</small>
        </div>
        <div className={'col-12 col-lg-6 offset-lg-3 my-2'}>
          <small className={'error-msg'}>{errormsg}</small>
        </div>
        <div className={'col-6 offset-3 mb-1'}>
          <div className={'float-left mt-1 mb-3'}>
            <button onClick={() => handleFormVisibility()} className={'btn btn-danger'}>
              <i className={'fas fa-arrow-left fa-fw'}></i>&nbsp;{i18n.form.list}
            </button>
          </div>
          <div className={'float-right mt-1 mb-3'}>
            <button onClick={()=>handleAddShowing(originator)} className={'btn btn-primary'}>
              {i18n.form.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddRemoveShowings({
  avatar,
  modalHeader,
  clients_url,
  partners_url,
  properties_url,
  property_id,
  client_id,
  showings_url,
  isAdmin,
  originator,
  i18n,
  closeMenuOnSelect,
  openMenuOnClick
}) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const handleFormVisibility = () => {
    setIsFormVisible(isFormVisible => !isFormVisible);
  };

  const [request, setRequest] = useState({
    url: `${showings_url}.json?${originator}_id=${originator === 'property' ? property_id : client_id}&originator=${originator}`,
    method: 'get',
    payload: {}
  });
  const didMountForSaveSearchRef = useRef(true);
  const { status, data, loading, setData } = useFetch(request, false, didMountForSaveSearchRef);

  useTooltips();
  usePopovers();

  const handleSetRequest = request => setRequest(request);

  const handleDeleteShowing = id => {
    handleSetRequest({
      url: showings_url,
      method: 'delete',
      payload: { showing_id: id, property_id: property_id }
    });
  };

  return (
    <div>
      <Spinner isLoading={loading} />
      {isFormVisible ? (
        <AddShowing
          i18n={i18n}
          clients_url={clients_url}
          partners_url={partners_url}
          showings_url={showings_url}
          properties_url={properties_url}
          property_id={property_id}
          client_id={client_id}
          originator={originator}
          isAdmin={isAdmin}
          handleSetRequest={handleSetRequest}
          handleFormVisibility={handleFormVisibility}
          closeMenuOnSelect={closeMenuOnSelect}
          openMenuOnClick={openMenuOnClick}
        />
      ) : (
        <>
          {status === 'Error' ? window.location.reload() : null}
          <div className={'mt-3'}>
            {avatar ? (
              <figure className="user-avatar property-avatar user-avatar-xxl mx-auto d-block mb-3">
                <img src={avatar} className={'rounded'} alt={'i18n.property_cover_alt'} />
              </figure>
            ) : null}
            <h2>{renderHTML(modalHeader)}</h2>
          </div>
          {originator === 'property' ? <hr /> : null}

          {data.length > 0 ? (
            <div className={'table-responsive'}>
              <table id="usersTable" className={`table table-striped ${loading ? 'reduced-opacity' : ''}`}>
                <thead>
                  <tr>
                    <th className={'text-nowrap'} scope="col">
                      {originator === 'client' ? i18n.table.property : i18n.table.client}
                    </th>
                    <th className={'text-nowrap'} scope="col">
                      {i18n.table.user}
                    </th>
                    <th className={'text-nowrap'} scope="col">
                      {i18n.table.date_title}
                    </th>
                    <th className={'text-nowrap text-center'} scope="col">
                      {i18n.table.actions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(entry => (
                    <tr key={entry['id']}>
                      <td className={'align-middle text-nowrap'}>
                        <div className={'table-entry'}>
                          {entry.entity_url ? <a href={entry.entity_url}>{entry.entity}</a> : entry.entity}
                        </div>
                      </td>
                      <td className={'align-middle text-nowrap'}>
                        <div className={'table-entry'}>
                          {entry.user_url && entry.isAdmin ? <a href={entry.user_url}>{entry.user}</a> : entry.user}
                        </div>
                      </td>
                      <td className={'align-middle text-nowrap'}>
                        <div className={'table-entry'}>
                          <span>{entry.date_string}</span>
                        </div>
                      </td>
                      <td className={'align-middle action-btns text-center'}>
                        <button
                          disabled={!entry.comments}
                          data-toggle="popover"
                          data-placement="auto"
                          data-trigger="hover"
                          title={i18n.form.comments}
                          data-content={entry.comments}
                          // className={`btn btn-md btn-icon btn-secondary btn-action ${!entry.comments ? 'disabled' : ''} ${!entry.canViewComments ? 'invisible' : '' }`}>
                          className={`btn btn-md btn-icon btn-secondary btn-action ${
                            !entry.comments ? 'disabled' : ''
                          } ${!entry.canViewComments ? 'invisible' : ''}`}>
                          <i className={`fas ${entry.comments ? 'fa-comment-alt' : 'fa-comment-slash'} colored`} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(i18n.table.delete_prompt)) handleDeleteShowing(entry['id']);
                          }}
                          data-toggle="tooltip"
                          data-position="top"
                          title={i18n.table.tooltip_delete}
                          className={`btn btn-md btn-icon btn-secondary btn-action ${
                            entry.canBeDeleted ? null : 'disabled'
                          }`}
                          disabled={!entry.canBeDeleted}>
                          <i className="fas fa-trash colored" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={'no-favlists'}>
              <i className="pr-icon md no-results"> </i>
              <h3>{i18n.no_lists_available}</h3>
            </div>
          )}
          <div className={'float-right mt-1 mb-3'}>
            <button
              className={'btn btn-outline-danger'}
              onClick={() => handleFormVisibility()}
              data-toggle="tooltip"
              data-position="top"
              title={i18n.table.add}>
              <i className="fas fa-plus" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AddRemoveShowings;
