import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddRemoveEntry({ todo, index, completeTodo, removeTodo }) {
  return (
    <div className="todo">
      {todo.text}

      <div>
        <button onClick={() => console.log('completed')}>Complete</button>
        {/*<button onClick={() => removeTodo(index)}>x</button>*/}
      </div>
    </div>
  );
}

function AddRemoveListForm({ addList }) {
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addList(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" className="input" value={value} onChange={e => setValue(e.target.value)} />
    </form>
  );
}

function AddRemoveFavLists() {
  const [lists, setLists] = useState([
    {
      text: 'Learn about React',
      isCompleted: false
    },
    {
      text: 'Meet friend for lunch',
      isCompleted: false
    },
    {
      text: 'Build really cool todo app',
      isCompleted: false
    }
  ]);

  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `You clicked ${count} times`;
    axios.get('http://shakalaka.lvh.me:3000/users/2/favlists.json')
      .then((res) => {
        console.log(res.data.message);
        // Set state with result
        // this.setState({data:res.data});
      });
  },[]);


  const addList = text => {
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
    <div className="app">
      <div className="todo-list">
        {lists.map((todo, index) => (
          <AddRemoveEntry key={index} index={index} todo={todo} completeTodo={null} removeTodo={null} />
        ))}
        <AddRemoveListForm addList={addList} />
      </div>
    </div>
  );
}

export default AddRemoveFavLists;
