import React, { useState } from 'react';

function useModalToggle (){
  const [isOpen, setIsOpen] = useState(false);
  return {isOpen, setIsOpen};
}

export default useModalToggle;