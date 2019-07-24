import ReactOnRails from 'react-on-rails';
import UsersListWithDatatable from '../bundles/datatables/UsersList';
import UsersListAssignableWithDatatable from '../bundles/datatables/UsersListAssignable';
import PropertiesListWithDatatable from '../bundles/datatables/PropertiesList';
import SimpleSelect from '../bundles/components/SimpleSelect';
import UsersMultiAsyncSelect from '../bundles/components/MultiAsyncSelect/UsersMultiAsyncSelect';
import DependantSelect from '../bundles/components/DependantSelect';
import ModalContainer from '../bundles/components/ModalContainer';

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  // HelloWorld,
  UsersListWithDatatable,
  UsersListAssignableWithDatatable,
  PropertiesListWithDatatable,
  SimpleSelect,
  DependantSelect,
  ModalContainer,
  UsersMultiAsyncSelect
});




