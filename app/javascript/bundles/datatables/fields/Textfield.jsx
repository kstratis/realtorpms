import React, { useState, useRef } from 'react';

const Textfield = (props) => {
  const { slug, name, options } = Object.values(props.cfield)[0];
  const [selection, setSelection] = useState(() =>
    props.storedSelection ? props.storedSelection[slug] : ''
  );

  const handleChange = (e) => {
    setSelection(e.target.value)
  };

  return (
    <div className={'col-12 mb-3'}>
      <input
        type="text"
        className="input form-control"
        value={selection}
        onChange={handleChange}
        placeholder={'search'}
      />
    </div>
  );
};

export default Textfield;
