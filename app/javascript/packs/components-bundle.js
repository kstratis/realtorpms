import ReactOnRails from 'react-on-rails';
import UsersListWithDatatable from '../bundles/datatables/UsersList';
import UsersListAssignableWithDatatable from '../bundles/datatables/UsersListAssignable';
import PropertiesListWithDatatable from '../bundles/datatables/PropertiesList';
import SimpleSelect from '../bundles/components/SimpleSelect';
import MultiAsyncSelectContainer from '../bundles/components/MultiAsyncSelectContainer';
import DependantSelect from '../bundles/components/DependantSelect';
import ModalContainer from '../bundles/components/ModalContainer';

// That's how react_on_rails "sees" our components in erb views.
// Unfortunately we need to register everything up-front.
ReactOnRails.register({
  UsersListWithDatatable,
  UsersListAssignableWithDatatable,
  PropertiesListWithDatatable,
  SimpleSelect,
  DependantSelect,
  ModalContainer,
  MultiAsyncSelectContainer
});




