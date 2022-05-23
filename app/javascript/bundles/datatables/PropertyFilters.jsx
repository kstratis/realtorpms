import React from 'react';
import AssociativeFormSelect from '../components/selects/AssociativeFormSelect';
import FormComponents from './fields/FormComponents';

function PropertyFilters(props) {
  const {
    i18n,
    clearHandler,
    count,
    buysell_filter,
    handlePriceInput,
    handleSizeInput,
    handleRoomsInput,
    handleFloorsInput,
    handleConstructionInput,
    handleChangePurpose,
    handleCfieldDropdown,
    handleCfieldTextfield,
    handleCfieldCheckbox,
    rooms_filter,
    construction_filter,
    handleCategoryInput,
    category_filter,
    price_filter,
    size_filter,
    floors_filter,
    cfields,
  } = props;

  return (
    <div className="card unset-card-box-shadow">
      <div className="card-header">
        <div className="table-entry">
          <div className="table-icon-wrapper">
            <i className="pr-icon xs filters" />
          </div>
          <span className="align-middle">&nbsp; {i18n.filters.title}</span>
          <div className="float-right">
            <span className="badge badge-pill badge-success p-2 mr-2">{`${i18n.entry_count}: ${count}`}</span>
            <a
              className={'btn btn-outline-danger btn-sm'}
              href={''}
              onClick={e => {
                clearHandler(e);
              }}>
              {i18n.clear}
            </a>
          </div>
        </div>
      </div>
      <div className="card-body col-md-6 offset-md-3 col-xl-12 offset-xl-0 py-5 py-xl-3">
        <label className="d-block">
          <h5 className="card-title filter-header">{i18n.filters.type.title}:</h5>
        </label>
        <div className="form-group">
          {buysell_filter['options'].map(filter => (
            <div key={filter['value']} className="custom-control custom-radio">
              <input
                type="radio"
                className="custom-control-input"
                name="rdGroup1"
                id={filter['value']}
                value={filter['value']}
                onChange={e => handleChangePurpose(e)}
                checked={buysell_filter['storedOption'] === filter['value']}
              />
              <label className="custom-control-label" htmlFor={filter['value']}>
                {filter['label']}
              </label>
            </div>
          ))}
        </div>
        <hr />
        <h5 className="card-title filter-header">{i18n.select.category}:</h5>
        <AssociativeFormSelect
          key={'associative-category'}
          name={'category'}
          options={category_filter['options']}
          i18n={i18n}
          mode={'associative'}
          renderFormFields={false}
          cleanupParams={false}
          callback={handleCategoryInput}
          isClearable={true}
          isSearchable={false}
          renderLabels={false}
          placeholderTextMaster={i18n.select.placeholder_plain}
          placeholderTextSlave={i18n.select.placeholder_plain}
          storedMasterOption={category_filter['storedMasterOption']}
          storedSlaveOption={category_filter['storedSlaveOption']}
        />
        <hr />
        <h5 className="card-title filter-header">{i18n.price}:</h5>
        <AssociativeFormSelect
          key={'range-price'}
          name={'price'}
          options={price_filter['options']}
          i18n={i18n}
          mode={'range'}
          renderFormFields={false}
          callback={handlePriceInput}
          isClearable={true}
          isSearchable={false}
          renderLabels={false}
          placeholderTextMaster={i18n.select.placeholder_prices_min}
          placeholderTextSlave={i18n.select.placeholder_prices_max}
          storedControllerOption={buysell_filter['storedOption']}
          storedMasterOption={price_filter['storedMasterOption']}
          storedSlaveOption={price_filter['storedSlaveOption']}
        />
        <hr />
        <h5 className="card-title filter-header">{i18n.size}:</h5>
        <AssociativeFormSelect
          key={'range-size'}
          name={'size'}
          options={size_filter['options']}
          i18n={i18n}
          mode={'range'}
          renderFormFields={false}
          callback={handleSizeInput}
          isClearable={true}
          isSearchable={false}
          renderLabels={false}
          placeholderTextMaster={i18n.select.placeholder_sizes_min}
          placeholderTextSlave={i18n.select.placeholder_sizes_max}
          storedControllerOption={size_filter['propertyType']}
          storedMasterOption={size_filter['storedMasterOption']}
          storedSlaveOption={size_filter['storedSlaveOption']}
        />
        <hr />
        <h5 className="card-title filter-header">{i18n.rooms}:</h5>
        <AssociativeFormSelect
          key={'range-rooms'}
          name={'rooms'}
          options={rooms_filter['options']}
          i18n={i18n}
          mode={'range'}
          renderFormFields={false}
          callback={handleRoomsInput}
          isClearable={true}
          isSearchable={false}
          renderLabels={false}
          placeholderTextMaster={i18n.select.placeholder_rooms_min}
          placeholderTextSlave={i18n.select.placeholder_rooms_max}
          storedControllerOption={rooms_filter['propertyType']}
          storedMasterOption={rooms_filter['storedMasterOption']}
          storedSlaveOption={rooms_filter['storedSlaveOption']}
        />
        <hr />
        <h5 className="card-title filter-header">{i18n.floors}:</h5>
        <AssociativeFormSelect
          key={'range-floors'}
          name={'floors'}
          options={floors_filter['options']}
          i18n={i18n}
          mode={'range'}
          renderFormFields={false}
          callback={handleFloorsInput}
          isClearable={true}
          isSearchable={false}
          renderLabels={false}
          placeholderTextMaster={i18n.select.placeholder_floors_min}
          placeholderTextSlave={i18n.select.placeholder_floors_max}
          storedControllerOption={floors_filter['propertyType']}
          storedMasterOption={floors_filter['storedMasterOption']}
          storedSlaveOption={floors_filter['storedSlaveOption']}
        />
        <hr />
        <h5 className="card-title filter-header">{i18n.construction}:</h5>
        <AssociativeFormSelect
          key={'range-construction'}
          name={'construction'}
          options={construction_filter['options']}
          i18n={i18n}
          mode={'range'}
          renderFormFields={false}
          callback={handleConstructionInput}
          isClearable={true}
          isSearchable={false}
          renderLabels={false}
          placeholderTextMaster={i18n.select.placeholder_construction_min}
          placeholderTextSlave={i18n.select.placeholder_construction_max}
          storedControllerOption={construction_filter['propertyType']}
          storedMasterOption={construction_filter['storedMasterOption']}
          storedSlaveOption={construction_filter['storedSlaveOption']}
        />
        <hr />
        {cfields.fields.map((cfield, index) => {
          return (
            <FormComponents
              key={index}
              cfield={cfield}
              storedSelection={cfields.storedSelections[Object.values(cfield)[0].slug] || null}
              i18n={i18n.cfields}
              handleCfieldDropdown={handleCfieldDropdown}
              handleCfieldTextfield={handleCfieldTextfield}
              handleCfieldCheckbox={handleCfieldCheckbox}
            />
          );
        })}
      </div>
    </div>
  );
}

export default PropertyFilters;
