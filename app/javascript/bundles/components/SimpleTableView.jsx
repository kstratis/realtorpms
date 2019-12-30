import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import AddRemoveFavLists from './AddRemoveFavLists';
import FlatPickrWrapper from './FlatPickrWrapper';
import Spinner from '../datatables/Spinner';
import AsyncSelectContainer from './selects/AsyncSelectContainer';

function AddViewing({ i18n, clients_url, partners_url, isAdmin, handleFormVisibility }) {
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
            action_endpoint={{ url: '', action: '', callback: void 0 }}
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
              action_endpoint={{ url: '', action: '', callback: void 0 }}
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
          <FlatPickrWrapper />
          <input className={'datetime'} />
        </div>
        <div className={'float-left mt-4 mb-3'}>
          <button onClick={() => handleFormVisibility()} className={'btn btn-danger'}>
            <i className={'fas fa-arrow-left fa-fw'}></i>&nbsp;{'Λίστα'}
          </button>
        </div>
        <div className={'float-right mt-4 mb-3'}>
          <button className={'btn btn-primary'}>{i18n.form.submit}</button>
        </div>
      </div>
    </div>
  );
}

function SimpleTableView({ clients_url, partners_url, property_id, viewings_url, isAdmin, i18n }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const handleFormVisibility = () => setIsFormVisible(isFormVisible => !isFormVisible);
  const [request, setRequest] = useState({
    url: `${viewings_url}.json?property_id=${property_id}`,
    method: 'get',
    payload: {}
  });

  const { data, loading, setData } = useFetch(request, false);

  console.log(data);
  return (
    <div>
      {isFormVisible ? (
        <AddViewing
          i18n={i18n}
          clients_url={clients_url}
          partners_url={partners_url}
          isAdmin={isAdmin}
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

export default SimpleTableView;
