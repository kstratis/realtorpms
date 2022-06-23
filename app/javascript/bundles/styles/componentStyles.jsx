const reactSelectStyles = {
  container: (base, state) => {
    return { ...base };
  },
  control: (base, state) => ({
    ...base,
    '&:hover': {
      cursor: 'text'
    }
  }),
  option: (base, state) => ({
    ...base,
    '&:hover': {
      cursor: 'pointer'
    }
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    '&:hover': {
      cursor: 'pointer'
    },
    transform: `${state.selectProps.menuIsOpen && 'rotate(180deg)'}`
  }),
  clearIndicator: (base, state) => ({
    ...base,
    '&:hover': {
      cursor: 'pointer'
    }
  }),
  input: (base, state) => ({
    ...base
    // flexBasis: '33.33%'
    // backgroundColor: 'red'
  }),
  singleValue: base => ({
    ...base,
    fontWeight: 700,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 3,
    // background: '#216AB0',
    background: '#216AB0',
    color: '#FFFFFF',
    // display: 'flex',
  }),

  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, backgroundColor: 'gray' } : base;
  },

  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 }
      : {...base,
        // background: '#00766c',
        background: '#00A28A',
        color: '#FFFFFF',
        padding: '2px 6px',
        borderRadius: '2px 0 0 2px',
      }
  },

  multiValueRemove: (base, state) => {
    return state.data.isFixed
      ? { ...base, display: 'none' }
      : { ...base, '&:hover': { cursor: 'pointer'}}

  },

  menuPortal: base => ({
    ...base,
    zIndex: 999999
  })
};

export { reactSelectStyles };