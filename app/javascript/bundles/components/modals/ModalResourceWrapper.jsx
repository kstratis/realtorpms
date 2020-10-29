import React, { useEffect } from "react";

const ModalResourceWrapper = props => {
  const ComponentResource = props.resource;

  useEffect(() => {
    $('#appModal').modal('show');
  }, []);

  useEffect(() => {
    $('#appModal').on('hidden.bs.modal', function (e) {
      props.hideModal();
    })
    return () => {
      $('#appModal').off('hidden.bs.modal');
    };
  });

  return <ComponentResource {...props.resourceProps} />;
};

export default ModalResourceWrapper;