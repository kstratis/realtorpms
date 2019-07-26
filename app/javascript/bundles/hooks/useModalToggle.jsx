import React, { useState, useEffect } from 'react';

function useModalToggle (){
  const [isOpen, setIsOpen] = useState(false);
  return {isOpen, setIsOpen};
}

export default useModalToggle;