import React, { useState } from 'react';

function useModalSwitch (){
  const [isOpen, setIsOpen] = useState(false);
  return [isOpen, setIsOpen];
}

export default useModalSwitch();