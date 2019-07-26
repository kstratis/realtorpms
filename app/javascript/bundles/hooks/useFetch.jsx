import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactOnRails from 'react-on-rails';
axios.defaults.headers.common['X-CSRF-Token'] = ReactOnRails.authenticityToken();

function useFetch(request, didMountRef = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const executeAjax = async () => {
      setLoading(true);
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

  // Retun setData is case the includer needs to use it.
  return { data, loading, setData };
}

export default useFetch;
