import ReactOnRails from 'react-on-rails';
import UsersListWithDatatable from '../bundles/datatables/UsersList';
import PropertiesListWithDatatable from '../bundles/datatables/PropertiesList';
import FormSelect from '../bundles/components/selects/FormSelect';
import MultiAsyncSelectContainer from '../bundles/components/selects/AsyncSelectContainer';
import NestedSelect from '../bundles/components/selects/NestedSelect';
import ModalContainer from '../bundles/components/ModalContainer';

// That's how react_on_rails "sees" our components in erb views.
// Unfortunately we need to register everything up-front.
ReactOnRails.register({
  UsersListWithDatatable,
  PropertiesListWithDatatable,
  FormSelect,
  NestedSelect,
  ModalContainer,
  MultiAsyncSelectContainer
});




