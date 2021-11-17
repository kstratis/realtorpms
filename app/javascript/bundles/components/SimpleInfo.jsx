import React, { useState, useRef } from 'react';
import useFetch from '../hooks/useFetch';

function SimpleInfo({ id, i18n, message }) {
  const didMountForSaveSearchRef = useRef(false);
  const [deleteRequest, setDeleteRequest] = useState({});
  const { data, loading } = useFetch(deleteRequest, false, didMountForSaveSearchRef);

  return (
    <div className={'mb-3'}>
      <h1>{message}</h1>
    </div>
  );
}

export default SimpleInfo;
