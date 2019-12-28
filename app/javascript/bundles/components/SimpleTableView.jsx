import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import AddRemoveFavLists from './AddRemoveFavLists';
import Spinner from '../datatables/Spinner';
import AsyncSelectContainer from './selects/AsyncSelectContainer';

function AddViewing() {
  return (
    <div>
      <h1>{'Add viewing screen'}</h1>
      <input className={'btn btn-primary'} type="submit" value={'edw'} />
      {/*<AsyncSelectContainer*/}
      {/*  id={'AsyncSelectContainer'}*/}
      {/*  i18n={{*/}
      {/*    select: {*/}
      {/*      hello: 'world'*/}
      // // add: i18n.select.add, // placeholder: i18n.select.placeholder_clients, // noresults: i18n.select.noresults,
      // loading: i18n.select.loading, // feedback: i18n.select.clientship_feedback
      {/*}*/}
      {/*}}*/}
      {/*isCreatable={false}*/}
      {/*isDisabled={false}*/}
      {/*isClearable={true}*/}
      {/*collection_endpoint={{ url: '', action: 'get' }}*/}
      {/*action_endpoint={{ url: '', action: '', callback: void(0)}}*/}
      {/*storedOptions={[]}*/}
      {/*hasFeedback={false}*/}
      {/*/>*/}
    </div>
  );
}

function SimpleTableView({ property_id, viewings_url, i18n }) {
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
        <AddViewing />
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
