import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import useTooltips from '../hooks/useTooltips';
import FlatPickrWrapper from './FlatPickrWrapper';
import Spinner from '../datatables/Spinner';
import AsyncSelectContainer from './selects/AsyncSelectContainer';

function AddShowing({
  i18n,
  clients_url,
  partners_url,
  showings_url,
  isAdmin,
  property_id,
  handleSetRequest,
  handleFormVisibility
}) {
  const [client, setClient] = useState({});
  const [partner, setPartner] = useState({});
  const [date, setDate] = useState({});
  const [errormsg, setErrormsg] = useState('');

  const asyncSetClient = selection => setClient(selection);
  const asyncSetPartner = selection => setPartner(selection);
  const asyncSetDate = selection => setDate(selection);

  const handleAddShowing = () => {
    const fieldsValidationArray = isAdmin ? [client, partner, date] : [client, date];
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
      payload: { client: client, partner: partner, dateStr: date.dateStr, property_id: property_id },
      callback: response => handleFormVisibility()
    });
  };

  return (
    <div className="favlist-container mt-3">
      <h2>{i18n.form.title}</h2>
      <hr />
      <div className={'favlist-body'}>
        <div className={'col-12 col-lg-6 offset-lg-3 my-2'}>
          <span className={'d-inline-block mt-2 mb-2'}>
            <strong>{i18n.form.client}</strong>
          </span>
          <AsyncSelectContainer
            id={'AsyncSelectContainerClient'}
            i18n={i18n}
            collection_endpoint={{ url: clients_url, action: 'get' }}
            action_endpoint={{ url: '', action: '', callback: asyncSetClient }}
            hasFeedback={false}
            isCreatable={false}
            isClearable={true}
            isMultiple={false}
          />
        </div>
        {isAdmin ? (
          <div className={'col-12 col-lg-6 offset-lg-3 my-2'}>
            <span className={'d-inline-block mt-2 mb-2'}>
              <strong>{i18n.form.partner}</strong>
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
            />
          </div>
        ) : null}
        <div className={'col-12 col-lg-6 offset-lg-3 my-2'}>
          <span className={'d-inline-block mt-2 mb-2'}>
            <strong>{i18n.form.date}</strong>
          </span>
          <FlatPickrWrapper handleChange={asyncSetDate} />
          <input className={'datetime'} />
        </div>
        <div className={'col-12 col-lg-6 offset-lg-3 my-2'}>
          <small className={'error-msg'}>{errormsg}</small>
        </div>
        <div className={'col-6 offset-3'}>
          <div className={'float-left my-3'}>
            <button onClick={() => handleFormVisibility()} className={'btn btn-danger'}>
              <i className={'fas fa-arrow-left fa-fw'}></i>&nbsp;{'Λίστα'}
            </button>
          </div>
          <div className={'float-right my-3'}>
            <button onClick={handleAddShowing} className={'btn btn-primary'}>
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
  property_id,
  showings_url,
  isAdmin,
  i18n
}) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const handleFormVisibility = () => {
    setIsFormVisible(isFormVisible => !isFormVisible);
  };

  const [request, setRequest] = useState({
    url: `${showings_url}.json?property_id=${property_id}`,
    method: 'get',
    payload: {}
  });
  const didMountForSaveSearchRef = useRef(true);
  const { status, data, loading, setData } = useFetch(request, false, didMountForSaveSearchRef);

  useTooltips();

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
          property_id={property_id}
          isAdmin={isAdmin}
          handleSetRequest={handleSetRequest}
          handleFormVisibility={handleFormVisibility}
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
            <h2>{modalHeader}</h2>
          </div>
          <hr />
          {data.length > 0 ? (
            <div className={'table-responsive'}>
              <table id="usersTable" className={`table table-striped ${loading ? 'reduced-opacity' : ''}`}>
                <thead>
                  <tr>
                    <th className={'text-nowrap'} scope="col">
                      {i18n.table.client}
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
                          {entry.client_url ? <a href={entry.client_url}>{entry.client}</a> : entry.client}
                        </div>
                      </td>
                      <td className={'align-middle text-nowrap'}>
                        <div className={'table-entry'}>
                          {entry.user_url ? <a href={entry.user_url}>{entry.user}</a> : entry.user}
                        </div>
                      </td>
                      <td className={'align-middle text-nowrap'}>
                        <div className={'table-entry'}>
                          <span>{entry.date_string}</span>
                        </div>
                      </td>
                      <td className={'align-middle action-btns text-center'}>
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
                          <i className="fas fa-trash user-delete" />
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
