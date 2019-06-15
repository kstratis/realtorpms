import React, { useState, useEffect } from 'react';
import axios from 'axios';

function useFetch(request) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const executeAjax = async () => {
      console.log('fetch executing');
      let indexStart = data.findIndex(element => element.id === request.id );
      console.log(indexStart);
      if (indexStart > -1) {
        let element = data[indexStart];
        element['isLoading'] = true;
        let newDataset = [...data];
        setData(newDataset);
      }








      // setLoading(true);
      const result = await axios({
        method: request.method,
        url: request.url,
        data: request.payload
      });
      setData(result.data.message);
      const indexEnd = data.findIndex(element => element.id === request.index);
      if (indexEnd > -1) {
        let element = data[indexEnd];
        element['isLoading'] = false;
        let newDataset = [...data];
        setData(newDataset);
      }
    };
    executeAjax();
  }, [request]);
  return { data, loading };
}

export default useFetch;