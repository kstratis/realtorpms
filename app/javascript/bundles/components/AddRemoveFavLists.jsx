import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useFetch from '../hooks/useFetch';
import Spinner from '../datatables/Spinner';

const spinner = document.getElementById('spinner');

function AddRemoveEntry({
  addEntity,
  favlist,
  index,
  favorites_url,
  property_id,
  completeFavlist,
  removeFavlist,
  // isLoading
}) {
  // const [checked, setChecked] = useState('');

  // const toggleFav = (favlist) => {
  // ajax call
  // filter out shit and update UI
  // console.log('works');
  // setRequest(payload);
  // };
  // const toggleFav = e => {
  //   setChecked(!checked);
  //   console.log('checked');
  // this.setState({isChecked: !this.state.isChecked});
  // };

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
          {favlist.isLoading ? <span>&nbsp;<i className="fas fa-circle-notch fa-spin" /></span> : null}
        </div>
      </div>
      {/*<button onClick={() => console.log('completed')}>Complete</button>*/}
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
          <div className={'col-sm-8'}>
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

function AddRemoveFavLists({ avatar, favlists_url, favorites_url, property_id, i18n }) {
  // console.log(fav_entity_url);
  // const [lists, setLists] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState({
    url: `${favlists_url}?property_id=${property_id}`,
    method: 'get',
    payload: {}
  });
  console.log(request);

  const { data } = useFetch(request);

  const addEntity = payload => {
    setRequest(payload);
  };

  // const toggleFav = fav => {
  //   setRequest({ url: favlists_post_url, method: 'post', payload: fav });
  // };

  // const completeTodo = index => {
  //   const newLists = [...lists];
  //   newLists[index].isCompleted = true;
  //   setLists(newLists);
  // };

  // const removeTodo = index => {
  //   const newTodos = [...lists];
  //   newTodos.splice(index, 1);
  //   setLists(newTodos);
  // };

  return (
    <div className="favlist-container mt-3">
      {avatar ? (
        <figure className="user-avatar property-avatar user-avatar-xxl mx-auto d-block">
          <img src={avatar} className={'rounded'} alt={'i18n.property_cover_alt'} />
        </figure>
      ) : null}
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
              // isLoading={loading}
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
      {/*<Spinner isLoading={loading} />*/}
      <AddRemoveListForm addEntity={addEntity} i18n={i18n} favlists_url={favlists_url} property_id={property_id} />
    </div>
  );
}

export default AddRemoveFavLists;
