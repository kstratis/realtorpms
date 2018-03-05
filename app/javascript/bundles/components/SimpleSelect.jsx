import React from 'react';
import Select from 'react-select';
import '!style-loader!css-loader!react-select/dist/react-select.css';

class SimpleSelect extends React.Component {
  state = {
    selectedOption: '',
  };
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  };
  render() {
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
    console.log(value);
    // console.log(this.props.name);

    return (
      <Select
        id={this.props.id}
        inputProps={{ 'data-name': this.props.name }}
        name={this.props.name }
        value={value}
        className={this.props.className}
        onChange={this.handleChange}
        options={this.props.options}
        placeholder={this.props.i18n.select.placeholder}
      />
    );
  }
}

export default SimpleSelect;