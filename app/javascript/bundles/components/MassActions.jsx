import React, { useState, useRef } from 'react';
import useFetch from '../hooks/useFetch';

function MassActions({ id, massDeletePersonsEndpoint, massFreezePersonsEndpoint, i18n, checkedItems }) {
  const didMountForSaveSearchRef = useRef(false);
  const [deleteRequest, setDeleteRequest] = useState({});
  const { data, loading } = useFetch(deleteRequest, false, didMountForSaveSearchRef);

  const massHandler = (action, url) => {
    if (!checkedItems) return;

    setDeleteRequest({
      url: url,
      method: action,
      payload: { selection: Object.keys(checkedItems).filter(i => checkedItems[i]) },
      callback: response => {
        // DEBUG
        // console.log(response);
        Turbolinks.visit(response, { action: 'replace' });
      },
    });
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-danger btn-lg btn-block"
        onClick={() => {
          if (window.confirm(i18n.datatable.confirm_prompt)) massHandler('delete', massDeletePersonsEndpoint);
        }}>
        <i className={'fas fa-trash fa-fw'} />
        &nbsp;{i18n.datatable.delete}
      </button>
      {id === 'user-list-modal' ? (
        <button
          type="button"
          className="btn btn-secondary btn-lg btn-block"
          onClick={() => {
            if (window.confirm(i18n.datatable.confirm_prompt)) massHandler('post', massFreezePersonsEndpoint);
          }}>
          <i className={'fas fa-exchange-alt fa-fw'} />
          &nbsp;{i18n.datatable.freeze}
        </button>
      ) : null}
    </div>
  );
}

export default MassActions;
