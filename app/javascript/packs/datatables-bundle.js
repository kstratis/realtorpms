import ReactOnRails from 'react-on-rails';

import HelloWorld from '../bundles/datatables/components/HelloWorld';
import DataTable from '../bundles/datatables/components/DataTable';

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  HelloWorld,
  DataTable
});
