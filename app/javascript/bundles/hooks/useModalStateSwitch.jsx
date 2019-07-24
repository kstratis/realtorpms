import React, { useState } from 'react';

function useModalStateSwitch (){
  const [isOpen, setIsOpen] = useState(false);
  return [isOpen, setIsOpen];
}

export default useModalStateSwitch();