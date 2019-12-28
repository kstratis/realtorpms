import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import AddRemoveFavLists from './AddRemoveFavLists';
import Spinner from '../datatables/Spinner';
import AsyncSelectContainer from './selects/AsyncSelectContainer';

function AddViewing({i18n, clients_url, partners_url}) {
  return (
    <div className="favlist-container mt-3">
      <h2>{i18n.form.title}</h2>
      <hr/>
      <div className={'favlist-body'}>
        <span className={'d-inline-block mb-1'}><strong>{i18n.form.client}</strong></span>
        <AsyncSelectContainer
          id={'AsyncSelectContainerClient'}
          i18n={i18n}
          collection_endpoint={{ url: clients_url, action: 'get' }}
          action_endpoint={{ url: '', action: '', callback: void(0) }}
          hasFeedback={false}
          isCreatable={false}
        />
        <span className={'d-inline-block mt-2 mb-1'}><strong>{i18n.form.partner}</strong></span>
        <AsyncSelectContainer
          id={'AsyncSelectContainerClient'}
          i18n={i18n}
          collection_endpoint={{ url: partners_url, action: 'get' }}
          action_endpoint={{ url: '', action: '', callback: void(0) }}
          hasFeedback={false}
          isCreatable={false}
        />
        <input className={'btn btn-primary'} type="submit" value={'edw'} />
      </div>
    </div>
  );
}

function SimpleTableView({ clients_url, partners_url, property_id, viewings_url, i18n }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
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
        <AddViewing i18n={i18n} clients_url={clients_url} partners_url={partners_url}/>
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
          <button onClick={()=> setIsFormVisible(true)}>hello</button></>
      )}
    </div>
  );
}

export default SimpleTableView;
