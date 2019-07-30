import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactOnRails from 'react-on-rails';
axios.defaults.headers.common['X-CSRF-Token'] = ReactOnRails.authenticityToken();

// didMountRef guards useEffect from running on first render
function useFetch(request, didMountRef = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const executeAjax = async () => {
      const result = await axios({
        method: request.method,
        url: request.url,
        data: request.payload
      });
      setData(result.data.message);
      setLoading(false);
      if (request.callback && typeof request.callback === 'function') {
        request.callback(result.data.message);
      }
    };
    if (didMountRef) {
      if (didMountRef.current) {
        executeAjax();
      } else {
        didMountRef.current = true;
      }
    } else {
      executeAjax();
    }
  }, [request]);

  // Return setData is case the includer needs to use it.
  return { data, loading, setData };
}

export default useFetch;
