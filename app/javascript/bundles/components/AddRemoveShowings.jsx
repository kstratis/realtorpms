import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import FlatPickrWrapper from './FlatPickrWrapper';
import Spinner from '../datatables/Spinner';
import AsyncSelectContainer from './selects/AsyncSelectContainer';

function AddShowing({ i18n, clients_url, partners_url, showings_url, isAdmin, property_id, handleSetRequest, handleFormVisibility }) {
  const [client, setClient] = useState('');
  const [partner, setPartner] = useState('');
  const [date, setDate] = useState({});

  const asyncSetClient = selection => {
    // DEBUG
    // console.log(selection);
    setClient(selection);
  };
  const asyncSetPartner = selection => {
    // DEBUG
    // console.log(selection);
    setPartner(selection);
  };
  const asyncSetDate = selection => {
    // DEBUG
    console.log(selection);
    setDate(selection);
  };

  const handleAddShowing = () => {
    if ([client, partner, date.dateStr].includes(undefined)) {
      console.log('something is empty');
      return;
    }

    // DEBUG
    // console.log('executing AJAX call - the requested option is:');
    // console.log(selectedOption);
    handleSetRequest({
      url: showings_url,
      method: 'post',
      payload: { selection: [client, partner, date.dateStr] || [] },
      // callback: response => {
        // DEBUG
        // console.log(response);
        // setRemoteResponse(response);
        // setIsFinished(true);
      // }
    });
  };




  return (
    <div className="favlist-container mt-3">
      <h2>{i18n.form.title}</h2>
      <hr />
      <div className={'favlist-body'}>
        <div>
          <span className={'d-inline-block mb-1'}>
            <strong>{i18n.form.client}</strong>
          </span>
          <AsyncSelectContainer
            id={'AsyncSelectContainerClient'}
            i18n={i18n}
            collection_endpoint={{ url: clients_url, action: 'get' }}
            action_endpoint={{ url: '', action: '', callback: asyncSetClient }}
            hasFeedback={false}
            isCreatable={false}
            isMultiple={false}
          />
        </div>
        {isAdmin ? (
          <div>
            <span className={'d-inline-block mt-2 mb-1'}>
              <strong>{i18n.form.partner}</strong>
            </span>
            <AsyncSelectContainer
              id={'AsyncSelectContainerClient'}
              i18n={i18n}
              collection_endpoint={{ url: partners_url, action: 'get' }}
              action_endpoint={{ url: '', action: '', callback: asyncSetPartner }}
              hasFeedback={false}
              isCreatable={false}
              isMultiple={false}
            />
          </div>
        ) : (
          // TODO add preselected partner
          <h1>no admin</h1>
        )}
        <div>
          <span className={'d-inline-block mt-2 mb-1'}>
            <strong>{i18n.form.date}</strong>
          </span>
          <FlatPickrWrapper handleChange={asyncSetDate} />
          <input className={'datetime'} />
        </div>
        <div className={'float-left mt-4 mb-3'}>
          <button onClick={() => handleFormVisibility()} className={'btn btn-danger'}>
            <i className={'fas fa-arrow-left fa-fw'}></i>&nbsp;{'Λίστα'}
          </button>
        </div>
        <div className={'float-right mt-4 mb-3'}>
          <button onClick={handleAddShowing} className={'btn btn-primary'}>{i18n.form.submit}</button>
        </div>
      </div>
    </div>
  );
}

function AddRemoveShowings({ clients_url, partners_url, property_id, showings_url, isAdmin, i18n }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const handleFormVisibility = () => setIsFormVisible(isFormVisible => !isFormVisible);

  const [request, setRequest] = useState({
      url: `${showings_url}.json?property_id=${property_id}`,
      method: 'get',
      payload: {}
  });
  const didMountForSaveSearchRef = useRef(false);
  const { data, loading, setData } = useFetch(request, false, didMountForSaveSearchRef);

  const handleSetRequest = request => {
    // DEBUG
    // console.log(selection);
    setRequest(request);
  };


  return (
    <div>
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
          <Spinner isLoading={loading} />
          {data.length > 0 ? (
            <div className={'table-responsive'}>
              <table id="usersTable" className={`table table-striped ${loading ? 'reduced-opacity' : ''}`}>
                <thead>
                  <tr>
                    <th scope="col">{i18n.table.client}</th>
                    <th scope="col">{i18n.table.user}</th>
                    <th scope="col">{i18n.table.date_title}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(entry => (
                    <tr key={entry['id']}>
                      <td>{entry.client}</td>
                      <td>{entry.user}</td>
                      <td>{entry.date_string}</td>
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
          <div className={'float-right my-2'}>
            <button className={'btn btn-primary'} onClick={() => handleFormVisibility()}>
              {i18n.table.add}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AddRemoveShowings;
