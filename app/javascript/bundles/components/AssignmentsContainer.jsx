import React from "react";
import AddRemoveUserAssignments from './AddRemoveUserAssignments';

// We need this "middleman" component as a workarounf to enable us to directly use hooks in react on rails until
// https://github.com/shakacode/react_on_rails/issues/1198 is resolved.
function AssignmentsContainer(props) {
  return (
    <AddRemoveUserAssignments {...props}/>
  );
}

export default AssignmentsContainer;