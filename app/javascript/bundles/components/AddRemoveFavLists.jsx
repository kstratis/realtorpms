import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';

function AddRemoveEntry({ addEntity, favlist, index, favorites_url, property_id, completeFavlist, removeFavlist }) {
  return (
    <div className={''}>
      <div className="form-group">
        <div className="custom-control custom-control-inline custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id={index}
            checked={!!favlist.isFaved}
            onChange={() =>
              addEntity({
                id: favlist.id,
                url: favorites_url,
                method: favlist.isFaved ? 'delete' : 'post',
                payload: { favlist_id: favlist.id, property_id: property_id }
              })
            }
          />
          <label className="custom-control-label" htmlFor={index}>
            {favlist.name}
          </label>
          {favlist.isLoading ? (
            <span>
              &nbsp;
              <i className="fas fa-cog fa-spin" />
            </span>
          ) : null}
        </div>
      </div>
      {/*<button onClick={() => removeTodo(index)}>x</button>*/}
    </div>
  );
}

function AddRemoveListForm({ addEntity, i18n, favlists_url, property_id }) {
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addEntity({ url: favlists_url, method: 'post', payload: { name: value, property_id: property_id } });
    setValue('');
  };

  return (
    <div className={'form-container'}>
      <form onSubmit={handleSubmit}>
        <div className="form-group row">
          <div className={'col-sm-8 mb-2 mb-sm-0'}>
            <input
              type="text"
              className="input form-control"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={i18n.listname_placeholder}
            />
          </div>

          <div className={'col-sm-4'}>
            <input className={'btn btn-primary'} type="submit" value={i18n.add_list_action} />
          </div>
        </div>
      </form>
    </div>
  );
}

function AddRemoveFavLists({ modalHeader, avatar, favlists_url, favorites_url, property_id, i18n }) {
  const [request, setRequest] = useState({
    url: `${favlists_url}.json?property_id=${property_id}`,
    method: 'get',
    payload: {}
  });

  const { data, loading, setData } = useFetch(request, false);

  // What is the best way to trigger an effect dependent on multiple parameters, only when one of the parameters change?
  // This is the question we must answer when using multiple `useEffect` with multiple interdependancies.
  // See this: https://stackoverflow.com/q/55724642/178728
  const prevLoadingRef = useRef();

  useEffect(() => {
    prevLoadingRef.current = loading;
  });
  const prevLoading = prevLoadingRef.current;

  // This useEffect uses and is thus dependant on `data`, `loading`, `setData` and `request`.
  // Setting data however (`setData`) will trigger itself again since it also depends on `data` and this will
  // cause an infinite loop of updates. To work around this, we make the effect run conditionally by examining its
  // previous state using `useRef`. https://stackoverflow.com/a/55724954/178728
  useEffect(() => {
    if (prevLoading !== loading) {
      const setLoader = status => {
        let indexStart = data.findIndex(element => element.id === request.id);
        if (indexStart > -1) {
          let element = data[indexStart];
          element['isLoading'] = status;
          let newDataset = [...data];
          setData(newDataset);
        }
      };

      if (data.length > 0) {
        setLoader(loading);
      }
    }
  }, [data, loading, setData, request]);

  const addEntity = payload => {
    setRequest(payload);
  };

  return (
    <div className="favlist-container mt-3">
      {avatar ? (
        <figure className="user-avatar property-avatar user-avatar-xxl mx-auto d-block">
          <img src={avatar} className={'rounded'} alt={'i18n.property_cover_alt'} />
        </figure>
      ) : null}
      <h2>{modalHeader}</h2>
      <hr />
      <div className={'favlist-body'}>
        {data.length > 0 ? (
          data.map((favlist, index) => (
            <AddRemoveEntry
              key={index}
              index={index}
              favlist={favlist}
              addEntity={addEntity}
              property_id={property_id}
              favlists_url={favlists_url}
              favorites_url={favorites_url}
              completeFavlist={null}
              removeFavlist={null}
            />
          ))
        ) : (
          <div className={'no-favlists'}>
            <i className="pr-icon md no-results"> </i>
            <h3>{i18n.no_lists_available}</h3>
          </div>
        )}
      </div>
      <hr />
      <AddRemoveListForm addEntity={addEntity} i18n={i18n} favlists_url={favlists_url} property_id={property_id} />
    </div>
  );
}

export default AddRemoveFavLists;
