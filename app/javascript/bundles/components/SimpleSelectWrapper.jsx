// import React from 'react';
// import SimpleSelect from './SimpleSelect';
//
// class SimpleSelectWrapper extends React.Component {
//   constructor(props) {
//     super(props);
//
//     // How to set initial state in ES6 class syntax
//     // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
//     this.state = {
//
//       // name: this.props.name
//     };
//   }
//   render(){
//     return (
//
//     <div className="row">
//       <div className="col-md-6 col-sm-12">
//         <div className="form-group mt-4 mb-4">
//           <label>{'Owner'}</label>
//
//           <span><i className={'fas fa-user fa-fw'} />&nbsp;{'Ιδιοκτήτης'}</span>
//         <abbr title={'Το πεδίο είναι υποχρεωτικό'}>*</abbr>
//
//
//           <SimpleSelect
//             id={'d'}
//             identity={'property_category_component'}
//             inputID={'property_ownerid'}
//             inputName={this.props.formdata.categoryname}
//             inputClassName={this.props.formdata.categoryClassName}
//             className={this.props.className}
//             formID={this.props.formdata.formid}
//             isMaster={true}
//             storedOption={this.props.storedMasterOption}
//             options={this.buildSelectOptions(this.props.options, true)}
//             handleOptions={this.handleOptions}
//             i18n={this.props.i18n}
//             disabled={false}
//             onRef={ref => (this.masterComponent = ref)}
//             soloMode={false}
//             searchable={this.props.searchable}
//             ajaxEnabled={false}
//             validatorGroup={this.props.validatorGroup}
//             feedback={this.props.formdata.categoryFeedback}
//             isRequired={this.props.isRequired}
//           />
//   })
//
//
// }
//
// export default SimpleSelectWrapper