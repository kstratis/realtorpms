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
  multiValueRemove: (base, state) => ({
    ...base,
    '&:hover': {
      cursor: 'pointer'
    }
  }),
  // menu: (base, state) => ({
  //   ...base,
  //   border: '1px solid #37474f',
  //   '&:hover': {
  //     cursor: 'pointer'
  //   }
  // }),
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
    paddingLeft: '5px',
    paddingRight: '5px'
  })
};

export { reactSelectStyles };