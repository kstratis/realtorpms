import React, { useState, useEffect, useRef } from 'react';
import AsyncSelectContainer from './selects/AsyncSelectContainer';
import useFetch from '../hooks/useFetch';

function AddRemovePartners({
  partners_url,
  partners_action_endpoint,
  storedOptions,
  hasFeedback,
  isMultiple,
  modalHeader,
  avatar,
  i18n
}) {


  const [request, setRequest] = useState({
    url: `${favlists_url}.json?property_id=${property_id}`,
    method: 'get',
    payload: {}
  });

  const { data, loading, setData } = useFetch(request, false);

  return (
    <>
      <div className={'mt-3'}>
        {avatar ? (
          <figure className="user-avatar property-avatar user-avatar-xxl mx-auto d-block mb-3">
            <img src={avatar} className={'rounded'} alt={'i18n.property_cover_alt'} />
          </figure>
        ) : null}
        <h2>{modalHeader}</h2>
      </div>
      <hr />
      <AsyncSelectContainer
        id={'AsyncSelectContainerPartner'}
        i18n={i18n}
        collection_endpoint={{ url: partners_url, action: 'get' }}
        action_endpoint={{ url: partners_action_endpoint, action: 'post' }}
        storedOptions={storedOptions}
        hasFeedback={hasFeedback}
        isMultiple={isMultiple}
      />
    </>
  );
}

export default AddRemovePartners;
