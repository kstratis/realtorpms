const reactSelectStyles = {
  container: (base, state) => {
    return { ...base };
  },
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
  singleValue: (base, state) => ({
    ...base,
    fontWeight: 700,
    backgroundColor: '#216AB0',
    color: '#FFFFFF',
    padding: '5px',
    borderRadius: '3px'
  })
};

export { reactSelectStyles };