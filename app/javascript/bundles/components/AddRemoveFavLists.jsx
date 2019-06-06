import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddRemoveEntry({ favlist, index, completeFavlist, removeFavlist, isLoading }) {
  return (
    <div className={isLoading ? 'reduced-opacity' : ''}>
      <div className="form-group">
        <div className="custom-control custom-control-inline custom-checkbox">
          <input type="checkbox" className="custom-control-input" id={index} />
          <label className="custom-control-label" htmlFor={index}>
            {favlist.name}
          </label>
        </div>
      </div>
      {/*<button onClick={() => console.log('completed')}>Complete</button>*/}
      {/*<button onClick={() => removeTodo(index)}>x</button>*/}
    </div>
  );
}

function AddRemoveListForm({ addFavlist, i18n }) {
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addFavlist(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group row">
        <div className={'col-sm-8'}>
          <input type="text" className="input form-control" value={value} onChange={e => setValue(e.target.value)} />
        </div>

        <div className={'col-sm-4'}>
          <input className={'btn btn-primary'} type="submit" value={i18n.add_list_action} />
        </div>
      </div>
    </form>
  );
}

function AddRemoveFavLists({ avatar, favlists_get_url, favlists_post_url, setLoading, isLoading, i18n }) {
  const [lists, setLists] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState({ url: favlists_get_url, method: 'get', payload: {} });

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      const result = await axios({
        method: request.method,
        url: request.url,
        data: request.payload
      });
      setLists(result.data.message);
      setLoading(false);
    };
    fetchPostData();
  }, [request]);

  const addFavlist = text => {
    setRequest({ url: favlists_post_url, method: 'post', payload: { name: text } });
  };

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
      <figure className="user-avatar property-avatar user-avatar-xxl mx-auto d-block">
        <img src={avatar} className={'rounded'} alt={'i18n.property_cover_alt'} />
      </figure>
      <hr />
      <div className={'favlist-body'}>
        {lists.length > 0 ? (
          lists.map((favlist, index) => (
            <AddRemoveEntry
              key={index}
              index={index}
              favlist={favlist}
              isLoading={isLoading}
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
      <AddRemoveListForm addFavlist={addFavlist} i18n={i18n} />
    </div>
  );
}

export default AddRemoveFavLists;
