import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddRemoveEntry({ favlist, index, completeFavlist, removeFavlist}) {
  return (
    <div className="">
      <div>
        <div className="form-group">
          <div className="custom-control custom-control-inline custom-checkbox">
            <input type="checkbox" className="custom-control-input" id={index} />
            <label className="custom-control-label" htmlFor={index}>{favlist.text}</label>
          </div>
        </div>
        {/*<button onClick={() => console.log('completed')}>Complete</button>*/}
        {/*<button onClick={() => removeTodo(index)}>x</button>*/}
      </div>
    </div>
  );
}

function AddRemoveListForm({ addFavlist }) {
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addFavlist(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" className="input" value={value} onChange={e => setValue(e.target.value)} />
    </form>
  );
}

function AddRemoveFavLists({avatar, favlists_url, i18n}) {
  console.log(favlists_url);
  // const [lists, setLists] = useState([
  //   {
  //     text: 'Learn about React',
  //     isCompleted: false
  //   },
  //   {
  //     text: 'Meet friend for lunch',
  //     isCompleted: false
  //   },
  //   {
  //     text: 'Build really cool todo app',
  //     isCompleted: false
  //   }
  // ]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserLists = () => {
    setLoading(!!loading);
    axios.get(`${favlists_url}.json`)
      .then((res) => {
        console.log(res.data.message);
        setLoading(false);
        // Set state with result
        // this.setState({data:res.data});
      });
  };



  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `You clicked ${count} times`;
    fetchUserLists();
  }, []);


  const addFavlist = text => {
    const newLists = [...lists, { text }];
    setLists(newLists);
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
    <div className="fav-list">
      <figure className="user-avatar property-avatar user-avatar-xxl mx-auto d-block">
        <img src={avatar} className={'rounded'} alt={'i18n.property_cover_alt'} />
      </figure>
      <hr />
      {loading ? (
        <div className="spinner-grow" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : lists.length > 0 ? (
        lists.map((favlist, index) => (
          <AddRemoveEntry key={index} index={index} favlist={favlist} completeFavlist={null} removeFavlist={null} />
        ))
      ) : (
        <div className={'no-favlists'}>
          <i className="pr-icon md no-results"> </i>
          <h3>{i18n.no_lists_available}</h3>
        </div>
      )}
      <hr />
      <AddRemoveListForm addFavlist={addFavlist} />
    </div>
  );
}

export default AddRemoveFavLists;
