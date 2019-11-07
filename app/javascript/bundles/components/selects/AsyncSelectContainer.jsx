import React from "react";
import AsyncSelect from './AsyncSelect';

// We need this "middleman" component as a workaround to enable us to directly use hooks in react on rails until
// https://github.com/shakacode/react_on_rails/issues/1198 is resolved.
function AsyncSelectContainer(props) {
  return (
    <AsyncSelect {...props} />
  );
}

export default AsyncSelectContainer;