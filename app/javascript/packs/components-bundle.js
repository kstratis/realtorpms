import ReactOnRails from 'react-on-rails';

import UsersListWithDatatable from '../bundles/datatables/UsersList';
import UsersListAssignableWithDatatable from '../bundles/datatables/UsersListAssignable';
import PropertiesListWithDatatable from '../bundles/datatables/PropertiesList';
import SimpleSelect from '../bundles/components/SimpleSelect';
import AjaxSelect from '../bundles/components/AjaxSelect';
import DependantSelect from '../bundles/components/DependantSelect';

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  // HelloWorld,
  UsersListWithDatatable,
  UsersListAssignableWithDatatable,
  PropertiesListWithDatatable,
  SimpleSelect,
  AjaxSelect,
  DependantSelect
  // PropertyType
});
