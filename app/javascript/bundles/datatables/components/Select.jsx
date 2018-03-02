import React from 'react';
import Select from 'react-select';
import '!style-loader!css-loader!react-select/dist/react-select.css';

class PropertyType extends React.Component {
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

    return (
      <Select
        id={this.props.id}
        name={this.props.name}
        value={value}
        className={this.props.className}
        onChange={this.handleChange}
        options={this.props.options}
        // options={[
        //   { value: 'one', label: 'One' },
        //   { value: 'two', label: 'Two' },
        // ]}
      />
    );
  }
}

export default PropertyType;