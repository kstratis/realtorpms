import React, { useState, useEffect, useRef } from 'react';
import useTooltips from '../hooks/useTooltips';
import usePopovers from '../hooks/usePopovers';

const ViewShowings = ({}) => {

  useTooltips();
  usePopovers();

  return (
    <div>
      <h1>works</h1>

    </div>
  );
};

export default ViewShowings;
