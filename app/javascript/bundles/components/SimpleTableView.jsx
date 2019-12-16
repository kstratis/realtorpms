import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import AddRemoveFavLists from './AddRemoveFavLists';
import Spinner from '../datatables/Spinner';

function SimpleTableView({ property_id, viewings_url, i18n }) {
  const [request, setRequest] = useState({
    url: `${viewings_url}.json?property_id=${property_id}`,
    method: 'get',
    payload: {}
  });

  const { data, loading, setData } = useFetch(request, false);

  console.log(data);
  return (
    <div>
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
    </div>
  );
}

export default SimpleTableView;
