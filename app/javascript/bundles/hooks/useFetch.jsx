import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { safelyExecCallback } from '../utilities/helpers';
import ReactOnRails from 'react-on-rails';
axios.defaults.headers.common['X-CSRF-Token'] = ReactOnRails.authenticityToken();

// react-select keeps its own internal state in which case maintaing our own and setting it on fetch kills performance
// and the user gets input lag.

// didMountRef is used to control whether useFetch will fire upon first mount. If set to true or is omitted altogether,
// useFetch will fire on first mount. Otherwise, if set to false, the ajax operation won't run on first mount.
function useFetch(request, dropdown = true, didMountRef = null) {
  const [status, setStatus] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const executeAjax = async () => {
      if (!dropdown) setLoading(true);
      const result = await axios({
        method: request.method,
        url: request.url,
        data: request.payload
      });
      if (!dropdown) {
        setStatus(result.data.status);
        setData(result.data.message);
        setLoading(false);
      }
      safelyExecCallback(request, result.data.message);
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
  return { status, data, loading, setData };
}

export default useFetch;
