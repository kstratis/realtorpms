import React, { useState, useRef } from 'react';
import AsyncSelectContainer from './selects/AsyncSelectContainer';
import useFetch from '../hooks/useFetch';
import Spinner from '../datatables/Spinner';

function AddRemovePartners({
  partners_url,
  partners_action_endpoint,
  initial_data_url,
  hasFeedback,
  isMultiple,
  isClearable,
  modalHeader,
  avatar,
  i18n
}) {
  const [request, setRequest] = useState({
    url: initial_data_url,
    method: 'get',
    payload: {}
  });

  // i.e. const refContainer = useRef(initialValue);
  // FROM THE DOCS: useRef returns a **mutable ref object** whose .current property is initialized to the passed argument (initialValue).
  const fireAjaxOnMount = useRef(true); // Here the .current property of the mutable object is set to true
  const { data, loading } = useFetch(request, false, fireAjaxOnMount);

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
      <div className={'mb-3'}>
      {loading ? (
        <Spinner isLoading={loading} />
      ) : (
        <AsyncSelectContainer
          id={'AsyncSelectContainerPartner'}
          i18n={i18n}
          collection_endpoint={{ url: partners_url, action: 'get' }}
          action_endpoint={{ url: partners_action_endpoint, action: 'post' }}
          storedOptions={data}
          hasFeedback={hasFeedback}
          isMultiple={isMultiple}
          isClearable={isClearable}
        />

      )}
      </div>
    </>
  );
}

export default AddRemovePartners;
